import express from 'express';
import next from 'next';
import discord from 'discord.js';
import chalk from 'chalk';
require('dotenv').config();

const dev: any = true;
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

	const clean = async (text: string) => {
		// If our input is a promise, await it before continuing
		if (text && text.constructor.name == 'Promise') text = await text;

		// If the response isn't a string, `util.inspect()`
		// is used to 'stringify' the code in a safe way that
		// won't error out on objects with circular references
		// (like Collections, for example)
		if (typeof text !== 'string') text = require('util').inspect(text, { depth: 1 });

		// Replace symbols with character code alternatives
		text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));

		// Send off the cleaned up result
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
function clean(evaled: any) {
	throw new Error('Function not implemented.');
}
