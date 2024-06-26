import express from 'express';
import quickdb from 'quick.db';
import discord from 'discord.js';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

import serverConfigs from '../models/serverConfigs';
import { reportError } from '../utils/error';
import { validateAndUpdate } from '../utils/validate';
import { bot } from '../index';

const sessions = new quickdb.table('sessions');
const router = express.Router();

router.use(
	cors({
		origin: process.env.HOST,
	})
);
router.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
		message: 'err-rate-limit',
	})
);

router.get('/list', (req: express.Request, res: express.Response) => {
	if (!req.body.servers) return res.send('err-missing-params');
	if (typeof req.body.servers !== 'string') return res.send('err-invalid-params');

	try {
		let guildsTheBotIsOn = bot.guilds.cache;
		let guildsTheUserIsOn: Array<any> = [];

		req.body.servers.forEach((server: string) => {
			if (guildsTheBotIsOn.has(server)) {
				guildsTheUserIsOn.push(server);
			}
		});

		return res.send(guildsTheUserIsOn);
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

router.get('/info', async (req: express.Request, res: express.Response) => {
	if (!req.body.server || !req.body.user) return res.send('err-missing-params');
	if (typeof req.body.server !== 'string' || typeof req.body.user !== 'object') return res.send('err-invalid-params');

	try {
		let session = sessions.get(`${req.body.user.id}_${req.body.user.sessionID}`);
		if (session == null) return res.send('err-session-expired');

		let server = session.servers.find((server: discord.Guild) => server.id == req.body.server);
		if (server == null) return res.send('err-server-not-found');

		if (server.isBotOnServer == false || !server.permissionsFlags.includes('MANAGE_GUILD') || server == undefined)
			return res.send('err-no-permissions');

		let guild = bot.guilds.cache.get(server.id);
		if (guild == undefined) return res.send('err-server-not-found');

		let serverConfig = await serverConfigs.findOne({ ServerID: req.body.server });
		if (serverConfig == null) {
			serverConfig = new serverConfigs({ ServerID: server.id });
			serverConfig.save();
		}

		return res.send({
			config: serverConfig,
			info: {
				id: guild.id,
				name: guild.name,
				icon: guild.icon,
				memberCount: guild.memberCount,
				large: guild.large,
				ownerID: guild.ownerId,
				emojiCount: guild.emojis.cache.size,
				channelCount: guild.channels.cache.size,
				roleCount: guild.roles.cache.size,
			},
		});
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

router.post('/save-changes', async (req: express.Request, res: express.Response) => {
	if (!req.body.user || !req.body.config || !req.body.server) return res.send('err-missing-params');
	if (typeof req.body.user !== 'object' || typeof req.body.config !== 'object' || typeof req.body.server !== 'string')
		return res.send('err-invalid-params');

	let areArraysEqual = (first: Array<any>, second: Array<any>) => {
		if (first.length !== second.length) {
			return false;
		}
		for (let i = 0; i < first.length; i++) {
			if (!second.includes(first[i])) {
				return false;
			}
		}
		return true;
	};

	try {
		let session = sessions.get(`${req.body.user.id}_${req.body.user.sessionID}`);
		if (session == null) return res.send('err-session-expired');

		let server = session.servers.find((server: discord.Guild) => server.id == req.body.server);
		if (server == null || server == undefined) return res.send('err-server-not-found');

		if (!server.permissionsFlags.includes('MANAGE_GUILD')) return res.send('err-no-permissions');

		let guild = bot.guilds.cache.get(req.body.server);
		if (guild == undefined) return res.send('err-server-not-found');

		let pastConfig = await serverConfigs.findOne({ ServerID: req.body.server });
		let generatedConfig = new serverConfigs(req.body.config);

		if (pastConfig == null) return res.send('err-server-not-found');

		if (!pastConfig.Users.Trusted.includes(req.body.user.id) && guild.ownerId !== req.body.user.id) {
			let pastConfigWithoutPrefixAndChannel = {
				...pastConfig._doc,
				Prefix: undefined,
				Channels: undefined,
			};

			let submittedConfigWithoutPrefixAndChannel = {
				...generatedConfig._doc,
				Prefix: undefined,
				Channels: undefined,
			};

			if (JSON.stringify(pastConfigWithoutPrefixAndChannel) !== JSON.stringify(submittedConfigWithoutPrefixAndChannel))
				return res.send('err-no-permissions');
		}

		// Check if there are changes on the trusted, if so, check if the user is the owner, if not, return error
		if (!areArraysEqual(pastConfig.Users.Trusted, req.body.config.Users.Trusted) && guild.ownerId !== req.body.user.id)
			return res.send('err-no-permissions');

		// Fix max and min values
		let newConfig = validateAndUpdate(generatedConfig);

		serverConfigs.findOneAndUpdate({ ServerID: req.body.server }, newConfig, { upsert: true }, (err, doc) => {
			if (err) return res.send('500');

			return res.send('success');
		});
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

export { router };
