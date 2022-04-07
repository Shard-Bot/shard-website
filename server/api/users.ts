import express from 'express';
import ms from 'ms';
import discord from 'discord.js';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

import { reportError } from '../utils/error';
import { bot } from '../index';
import { UserSearchResult } from 'typings';

const router = express.Router();
router.use(
	cors({
		origin: process.env.HOST,
	})
);
router.use(
	rateLimit({
		windowMs: ms('5s'),
		max: 10,
		message: 'err-rate-limit',
	})
);

router.post('/search', (req: express.Request, res: express.Response) => {
	let { server, query } = req.body;
	if (!server || !query) return res.send('err-missing-params');
	if (typeof server !== 'string' || typeof query !== 'string') return res.send('err-invalid-params');

	try {
		let server: discord.Guild | undefined = bot.guilds.cache.get(req.body.server);
		if (!server) return res.send('err-server-not-found');

		return server.members.fetch().then((members: any) => {
			let serverMembers = members.filter((member: discord.GuildMember) =>
				member.user.username.toLowerCase().includes(req.body.query.toLowerCase())
			);

			serverMembers = Array.from(serverMembers.values());
			serverMembers = serverMembers.slice(0, 5);

			let users = serverMembers.map((member: discord.GuildMember) => {
				return {
					id: member.id,
					username: member.user.username,
					avatar: member.user.avatarURL(),
					discriminator: member.user.discriminator,
				};
			});

			return res.send(users);
		});
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

router.post('/getInfo', (req: express.Request, res: express.Response) => {
	let { server, users } = req.body;
	if (!server || !users) return res.send('err-missing-params');
	if (typeof server !== 'string' || typeof users !== 'object') return res.send('err-invalid-params');

	try {
		let guild = bot.guilds.cache.get(req.body.server);
		if (!guild) return res.send('err-server-not-found');

		return guild.members.fetch().then((members) => {
			let users: Array<UserSearchResult> = [];

			req.body.users.forEach((user: string) => {
				let member = members.get(user);
				if (member) {
					users.push({
						id: member.id,
						username: member.user.username,
						discriminator: member.user.discriminator,
					});
				}
			});

			return res.send(users);
		});
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

export { router };
