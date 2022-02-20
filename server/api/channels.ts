import express from 'express';
import ms from 'ms';
import discord from 'discord.js';

import { reportError } from '../utils/error';
import { bot } from '../index';
import { ChannelsSearchResult } from 'typings';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

const router = express.Router();
router.use(
	cors({
		origin: process.env.HOST,
	})
);

router.post(
	'/search',
	rateLimit({
		windowMs: ms('10s'),
		max: 10,
		message: 'err-rate-limit',
	}),
	(req: express.Request, res: express.Response) => {
		if (!req.body.query || !req.body.server) return res.send('err-missing-params');
		if (typeof req.body.query !== 'string' || typeof req.body.server !== 'string') return res.send('err-invalid-params');

		try {
			// @ts-ignore
			let channels: Array<discord.GuildChannel> = bot.guilds.cache.get(req.body.servers)?.channels.cache;
			let results: Array<ChannelsSearchResult> = [];

			channels.forEach((channel: discord.GuildChannel) => {
				if (channel.type === 'GUILD_TEXT' && channel.name.toLowerCase().includes(req.body.query.toLowerCase())) {
					results.push({
						id: channel.id,
						name: channel.name,
						type: channel.type,
					});
				}
			});

			return res.send(results.splice(0, 5));
		} catch (err) {
			reportError(err);
			return res.send('err-internal-error');
		}
	}
);

export { router };
