import { app } from '../index';
import { reportError } from '../utils/error';
import chalk from 'chalk';

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
// import helmet from 'helmet';
import ms from 'ms';

try {
	app.use(express.static(path.join(__dirname, '../../src/public')));
	app.use('/assets/', express.static(path.join(__dirname, '../../src/assets')));

	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(
		session({
			secret: process.env.SESSION_SECRET as string,
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: false,
				maxAge: ms('1 day'),
			},
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function (user: any, done: any) {
		done(null, user);
	});

	passport.deserializeUser(function (user: any, done: any) {
		done(null, user);
	});

	console.log(chalk.cyan('info ') + '- Middleware loaded');
} catch (err) {
	console.log(chalk.red('error ') + '- Failed to load middleware');
	reportError(err);
}

export {};
