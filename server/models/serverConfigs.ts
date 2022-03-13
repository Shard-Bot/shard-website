import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const serverConfigs = new mongoose.Schema({
	ServerID: String,
	Prefix: {
		type: String,
		default: 's!',
	},

	Channels: {
		JoinLog: String,
		ExitLog: String,
		ModLog: String,
	},

	Roles: {
		MuteRol: String,
	},

	Users: {
		Trusted: Array,
	},

	modules: {
		AntiNuker: {
			Enabled: Boolean,
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
			Config: {
				maxBans: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxCreateEmojis: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxDeleteEmojis: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxCreatedChannels: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxCreatedRoles: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxDeletedChannels: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxDeletedRoles: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxKicks: {
					Enabled: Boolean,
					Limit: Number,
				},
				maxUnbans: {
					Enabled: Boolean,
					Limit: Number,
				},
			},
		},

		Lockdown: {
			Enabled: Boolean,
			Mode: String,
			Target: String,
		},

		Automod: {
			Enabled: Boolean,
			Words: [
				{
					Word: String,
					Percent: Number,
				},
			],
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
		},

		AntiWallText: {
			Enabled: Boolean,
			Limit: Number,
			PercentTimeLimit: Number,
			Percent: Number,
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
		},

		AntiFlood: {
			Enabled: Boolean,
			PercentTimeLimit: Number,
			Percent: Number,
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
		},

		AntiCaps: {
			Enabled: Boolean,
			Limit: Number,
			Percent: Number,
			PercentTimeLimit: Number,
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
		},

		AntiLinks: {
			AllowImages: Boolean,
			Percent: Number,
			PercentTimeLimit: Number,
			Whitelist: {
				Roles: Array,
				Users: Array,
			},
		},
	},
});

export default mongoose.model('serverConfigs', serverConfigs, 'serverconfigs');
