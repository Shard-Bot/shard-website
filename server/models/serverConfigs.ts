import mongoose from 'mongoose';

const serverConfigs = new mongoose.Schema({
	ServerID: {
		type: String,
		required: true,
		unique: true,
	},
	Prefix: {
		type: String,
		default: 's!',
	},

	Channels: {
		JoinLog: {
			type: String,
			default: '',
		},
		ExitLog: {
			type: String,
			default: '',
		},
		ModLog: {
			type: String,
			default: '',
		},
		BotLog: {
			type: String,
			default: '',
		},
	},

	Roles: {
		MuteRol: {
			type: String,
			default: '',
		},
	},

	Users: {
		Trusted: {
			type: Array,
			default: [],
		},
	},

	Modules: {
		AntiNuker: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
			Config: {
				maxBans: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxCreateEmojis: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxDeleteEmojis: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxCreatedChannels: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxCreatedRoles: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxDeletedChannels: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxDeletedRoles: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxKicks: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxUnbans: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 5,
					},
				},
				maxInvitedBots: {
					Enabled: {
						type: Boolean,
						default: true,
					},
					Limit: {
						type: Number,
						default: 1,
					},
					IgnoreVerified: {
						type: Boolean,
						default: true,
					},
				},
			},
		},

		Lockdown: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			Mode: {
				type: String,
				default: 'mute',
			},
			Target: {
				type: String,
				default: 'alts',
			},
		},

		Automod: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			PercentTimeLimit: {
				type: Number,
				default: 10,
			},
			Words: [
				{
					Word: String,
					Percent: Number,
				},
			],
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
		},

		AntiWallText: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			Limit: {
				type: Number,
				default: 600,
			},
			PercentTimeLimit: {
				type: Number,
				default: 10,
			},
			Percent: {
				type: Number,
				default: 100,
			},
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
		},

		AntiFlood: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			PercentTimeLimit: {
				type: Number,
				default: 10,
			},
			Percent: {
				type: Number,
				default: 15,
			},
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
		},

		AntiCaps: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			Limit: {
				type: Number,
				default: 30,
			},
			Percent: {
				type: Number,
				default: 30,
			},
			PercentTimeLimit: {
				type: Number,
				default: 10,
			},
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
		},

		AntiLinks: {
			Enabled: {
				type: Boolean,
				default: false,
			},
			AllowImages: {
				type: Boolean,
				default: false,
			},
			Percent: {
				type: Number,
				default: 100,
			},
			PercentTimeLimit: {
				type: Number,
				default: 10,
			},
			Whitelist: {
				Roles: {
					type: Array,
					default: [],
				},
				Users: {
					type: Array,
					default: [],
				},
			},
		},
	},
});

export default mongoose.model('serverConfigs', serverConfigs, 'serverConfigsTesting');
