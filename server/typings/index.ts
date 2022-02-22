import discord from 'discord.js';
import { Request } from 'express';

declare module 'express-serve-static-core' {
	interface Request {
		user: SessionUser;
	}
}

interface ServerData extends discord.OAuth2Guild {
	permissionsFlags: Array<string>;
	isBotOnServer: boolean;
}

interface SessionUser extends discord.User {
	sessionID: string;
}

interface ChannelsSearchResult {
	id: string;
	name: string;
	type: string;
}

interface RolesSearchResult {
	id: string;
	name: string;
}

interface UserSearchResult {
	id: string;
	username: string;
	discriminator: string;
}

export type { ServerData, SessionUser, Request, ChannelsSearchResult, RolesSearchResult, UserSearchResult };
