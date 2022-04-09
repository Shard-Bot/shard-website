import discord from 'discord.js';

export const reportError: Function = (err: Error) => {
	console.error(err);

	const webhook = new discord.WebhookClient({
		url: process.env.ERROR_WEBHOOK_URL as string,
	});

	webhook.send(`<@${process.env.ERROR_WEBHOOK_STAFF}> **New error reported, check console for details.**\n\`\`\`\n\n\n${err.name}\n${err.message}\`\`\``).catch(console.error);
};
