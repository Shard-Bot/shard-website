import express from 'express';
import quickdb from 'quick.db';

import rateLimit from 'express-rate-limit';
import cors from 'cors';

import getLang from '../utils/locales';

const router = express.Router();
const sessions = new quickdb.table('sessions');

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

// Routes
router.get('/main/', (req: express.Request, res: express.Response) => {
	switch (req.query.page) {
		case 'index':
			res.status(200).send({ lang: getLang(req.headers['accept-language']).main.index });
			break;

		case 'servers':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).main.servers,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
	}
});

router.get('/dashboard', (req: express.Request, res: express.Response) => {
	switch (req.query.page) {
		case 'index':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.index,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'general':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.general,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'antispam':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.antispam,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'antinuker':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.antinuker,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'lockdown':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.lockdown,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'automod':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.automod,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
		case 'lockdown':
			res.status(200).send({
				lang: getLang(req.headers['accept-language']).dashboard.lockdown,
				session: sessions.get(`${req.user.id}_${req.user.sessionID}`),
			});
			break;
	}
});

export { router };
