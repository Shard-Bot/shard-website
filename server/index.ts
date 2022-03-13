import express from 'express';
import next from 'next';
import discord from 'discord.js';
import chalk from 'chalk';
require('dotenv').config();

const dev: any = true
const port: string | number = process.env.PORT || 3000;

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app: express.Application = express();
const bot = new discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MEMBERS'],
});

nextApp.prepare().then(() => {
	require('./config/middleware');
	require('./config/database');
	require('./config/routes');

	app.get('*', (req: express.Request, res: express.Response) => {
		handle(req, res);
	});

	bot.login(process.env.DISCORD_TOKEN);

	bot.on('ready', () => {
		console.log(chalk.magenta('event ') + `- ${bot.user?.username} is ready`);
	});

	app.listen(port, () => {
		console.log(chalk.magenta('event ') + `- App is running on port ${port}`);
	});
});

export { nextApp, app, bot };
