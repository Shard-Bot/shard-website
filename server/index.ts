import express from 'express';
import next from 'next';
import discord from 'discord.js';
import chalk from 'chalk';
import minimist from 'minimist';

require('dotenv').config();

let launchArgs = minimist(process.argv.slice(2), {
	string: ['dev', 'port'],
	default: {
		dev: true,
		port: 8080,
	},
});

const dev: any = launchArgs.dev === 'true' || launchArgs.dev === true;
const port: string | number = launchArgs.port;

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

	bot.login(process.env.TOKEN);

	bot.on('ready', () => {
		console.log(chalk.magenta('event ') + `- ${bot.user?.username} is ready`);
	});

	const clean = async (text: string) => {
		// If our input is a promise, await it before continuing
		if (text && text.constructor.name == 'Promise') text = await text;
		if (typeof text !== 'string') text = require('util').inspect(text, { depth: 1 });

		text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));

		return text;
	};

	bot.on('messageCreate', async (message: discord.Message) => {
		const args = message.content.split(' ').slice(1);

		if (message.content.startsWith(`p?eval`)) {
			if (message.author.id !== '516688206020739243') return;

			try {
				const evaled = eval(args.join(' '));
				const cleaned: string = await clean(evaled);

				message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
			} catch (err) {
				message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
			}
		}
	});

	app.listen(port, () => {
		console.log(chalk.magenta('event ') + `- App is running on port ${port}`);
	});
});

export { nextApp, app, bot };
