import express from 'express';
import quickdb from 'quick.db';
import axios from 'axios';
import ms from 'ms';
import discord from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

import { bot } from '../index';
import { reportError } from '../utils/error';
import { ServerData } from 'typings';

const router = express.Router();
const sessions = new quickdb.table('sessions');

router.use(
	cors({
		origin: process.env.HOST,
	})
);
router.use(
	rateLimit({
		windowMs: ms('5h'),
		max: 5,
		message: 'err-rate-limit',
	})
);

// Routes
router.get('/login', async (req: express.Request, res: express.Response) => {
	if (!req.query.code) return res.send({ success: false, message: 'err-missing-params' });
	if (typeof req.query.code !== 'string') return res.send({ success: false, message: 'err-invalid-params' });

	let code = req.query.code;

	try {
		let oauthResult = await axios({
			method: 'post',
			url: 'https://discord.com/api/oauth2/token',
			// @ts-ignore
			data: new URLSearchParams({
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: process.env.REDIRECT_URI,
				scope: 'identify guilds',
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		if (oauthResult.status == 400) return res.send({ success: false, message: 'err-invalid-params' });

		let servers = await axios({
			method: 'get',
			url: 'https://discord.com/api/users/@me/guilds',
			headers: {
				Authorization: `Bearer ${oauthResult.data.access_token}`,
			},
		});

		let user = await axios({
			method: 'get',
			url: 'https://discord.com/api/users/@me',
			headers: {
				Authorization: `Bearer ${oauthResult.data.access_token}`,
			},
		});

		// Generate random uuid v4
		user.data.sessionID = uuidv4();
		let botServers = bot.guilds.cache;

		servers.data.forEach((element: ServerData) => {
			element.isBotOnServer = botServers.has(element.id);
			element.permissionsFlags = new discord.Permissions(`${element.permissions}` as discord.PermissionString).toArray();
		});

		return req.login(user.data, async (err: Error) => {
			if (err) throw err;

			await sessions.set(`${user.data.id}_${user.data.sessionID}`, {
				user: user.data,
				servers: servers.data,
			});
			return res.redirect('/dashboard');
		});
	} catch (err) {
		reportError(err);
		return res.send({ success: false, message: 'err-internal-error' });
	}
});

router.get('/logout', (req: express.Request, res: express.Response) => {
	try {
		if (!req.user) return res.send({ success: false, message: 'err-not-logged-in' });
		sessions.delete(`${req.user.id}_${req.user.sessionID}`);

		req.logout();
		return res.send({ success: true, message: 'ok' });
	} catch (err) {
		reportError(err);
		return res.send({ success: false, message: 'err-internal-error' });
	}
});

router.get('/loginRedirect', (_req: express.Request, res: express.Response) => {
	try {
		return res.redirect(
			`https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=identify%20guilds`
		);
	} catch (err) {
		reportError(err);
		return res.send({ success: false, message: 'err-internal-error' });
	}
});

export { router };
