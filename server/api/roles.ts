import express from 'express';
import discord from 'discord.js';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

import { reportError } from '../utils/error';
import { bot } from '../index';
import { RolesSearchResult } from 'typings';

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

router.post('/search', (req: express.Request, res: express.Response) => {
	if (!req.body.query || !req.body.server) return res.send('err-missing-params');
	if (typeof req.body.query !== 'string' || typeof req.body.server !== 'string') return res.send('err-invalid-params');

	try {
		// @ts-ignore
		let roles: Array<discord.Role> = bot.guilds.cache.get(req.body.server)?.roles.cache;
		if (roles === undefined) return res.send('err-invalid-params');

		let results: Array<RolesSearchResult> = [];

		roles.forEach((role: discord.Role) => {
			if (role?.name.toLowerCase().includes(req.body.query.toLowerCase())) {
				results.push({
					id: role.id,
					name: role.name,
				});
			}
		});

		return res.send(results.splice(0, 5));
	} catch (err) {
		reportError(err);
		return res.send('err-internal-error');
	}
});

export { router };
