import express from 'express';
import ms from 'ms';
import discord, { GuildChannel } from 'discord.js';

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
			let channels: Array<discord.GuildChannel> = bot.guilds.cache.get(req.body.server)?.channels.cache;
			let results: Array<ChannelsSearchResult> = [];

			if (!channels) return res.send('err-no-channels');

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

router.post('/info', async (req, res) => {
	if (!req.body.channels) return res.send('err-missing-params');
	if (typeof req.body.channels !== 'object' || req.body.channels.length == 0) return res.send('err-invalid-params');

	try {
		let channelResult: any = {};

		req.body.channels.forEach((object: any) => {
			let channel: any = bot.channels.cache.get(object.id);

			if (channel) {
				return (channelResult[object.key] = {
					label: channel.name,
					value: channel.id,
				});
			}

			return (channelResult[object.key] = {
				label: '',
				value: '',
			});
		});

		return res.send(channelResult);
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

router.post('/getInfo', async (req, res) => {
	if (!req.body.server || !req.body.channels) return res.send('err-missing-params');
	if (typeof req.body.server !== 'string' || typeof req.body.channels !== 'object') return res.send('err-invalid-params');

	try {
		let result: any = [];

		let server: any = bot.guilds.cache.get(req.body.server);
		if (!server) return res.send('err-no-server');

		req.body.channels.forEach((channel: any) => {
			let channelObject: any = server.channels.cache.get(channel);

			if (channelObject && channelObject.type == 'GUILD_TEXT') {
				result.push({
					value: channelObject.id,
					label: channelObject.name,
				});
			}
		});

		return res.send(result);
	} catch (err) {
		reportError(err);
		return res.send('500');
	}
});

export { router };
