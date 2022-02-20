import discord from 'discord.js';

export const reportError: Function = (err: Error) => {
	// @ts-ignore
	if (err?.stack?.length > 1500) return console.error(err.stack?.slice(0, 1800) + '...');

	const webhook = new discord.WebhookClient({
		// @ts-ignore
		id: process.env.ERROR_LOG_CHANNEL,
		// @ts-ignore
		token: process.env.ERROR_LOG_TOKEN,
	});

	webhook
		.send(`<@516688206020739243>\n\`\`\`\n\n\n**${err.name}**\n${err.message}\n\n${err.stack?.slice(0, 1800)}\n\`\`\``)
		.catch(console.error);
};
