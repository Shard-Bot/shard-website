import serverConfigs from '../models/serverConfigs';

const validateAndUpdate = (config: any) => {
	if (!config) return new serverConfigs();

	if (config.Prefix.length > 6) config.Prefix = 's!';

	if (config.Channels.JoinLog.length > 18) config.Channels.JoinLog = '';
	if (config.Channels.ExitLog.length > 18) config.Channels.ExitLog = '';
	if (config.Channels.ModLog.length > 18) config.Channels.ModLog = '';
	if (config.Channels.BotLog.length > 18) config.Channels.BotLog = '';
	if (config.Roles.MuteRol.length > 18) config.Roles.MuteRol = '';

	if (config.Modules.AntiNuker.Config.maxBans.Limit > 10 || config.Modules.AntiNuker.Config.maxBans.Limit < 2)
		config.Modules.AntiNuker.Config.maxBans.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxCreateEmojis.Limit > 10 || config.Modules.AntiNuker.Config.maxCreateEmojis.Limit < 2)
		config.Modules.AntiNuker.Config.maxCreateEmojis.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxDeleteEmojis.Limit > 10 || config.Modules.AntiNuker.Config.maxDeleteEmojis.Limit < 2)
		config.Modules.AntiNuker.Config.maxDeleteEmojis.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxCreatedChannels.Limit > 10 || config.Modules.AntiNuker.Config.maxCreatedChannels.Limit < 2)
		config.Modules.AntiNuker.Config.maxCreatedChannels.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxCreatedRoles.Limit > 10 || config.Modules.AntiNuker.Config.maxCreatedRoles.Limit < 2)
		config.Modules.AntiNuker.Config.maxCreatedRoles.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxDeletedChannels.Limit > 10 || config.Modules.AntiNuker.Config.maxDeletedChannels.Limit < 2)
		config.Modules.AntiNuker.Config.maxDeletedChannels.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxDeletedRoles.Limit > 10 || config.Modules.AntiNuker.Config.maxDeletedRoles.Limit < 2)
		config.Modules.AntiNuker.Config.maxDeletedRoles.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxKicks.Limit > 10 || config.Modules.AntiNuker.Config.maxKicks.Limit < 2)
		config.Modules.AntiNuker.Config.maxKicks.Limit = 5;
	if (config.Modules.AntiNuker.Config.maxUnbans.Limit > 10 || config.Modules.AntiNuker.Config.maxUnbans.Limit < 2)
		config.Modules.AntiNuker.Config.maxUnbans.Limit = 5;

	if (config.Modules.Lockdown.Mode !== 'mute' && config.Modules.Lockdown.Mode !== 'ban' && config.Modules.Lockdown.Mode !== 'kick')
		config.Modules.Lockdown.Mode = 'mute';
	if (config.Modules.Lockdown.Target !== 'alts' && config.Modules.Lockdown.Target !== 'bots' && config.Modules.Lockdown.Target !== 'all')
		config.Modules.Lockdown.Target = 'alts';

	if (config.Modules.Automod.PercentTimeLimit > 3600 || config.Modules.Automod.PercentTimeLimit < 5)
		config.Modules.Automod.PercentTimeLimit = 10;
	if (config.Modules.Automod.Words.length > 25) config.Modules.Automod.Words.splice(25, 1);
	for (let word in config.Modules.Automod.Words) {
		if (config.Modules.Automod.Words[word].length > 25) config.Modules.Automod.Words.splice(word, 1);
	}

	if (config.Modules.AntiWallText.Limit < 300) config.Modules.AntiWallText.Limit = 300;
	if (config.Modules.AntiWallText.Percent !== 100) config.Modules.AntiWallText.Percent = 100;

	if (config.Modules.AntiFlood.Percent > 100 || config.Modules.AntiFlood.Percent < 10) config.Modules.AntiFlood.Percent = 15;
	if (config.Modules.AntiFlood.PercentTimeLimit > 3600 || config.Modules.AntiFlood.PercentTimeLimit < 5)
		config.Modules.AntiFlood.PercentTimeLimit = 10;

	if (config.Modules.AntiCaps.Limit < 10) config.Modules.AntiCaps.Limit = 30;
	if (config.Modules.AntiCaps.Percent > 100 || config.Modules.AntiCaps.Percent < 20) config.Modules.AntiCaps.Percent = 30;
	if (config.Modules.AntiCaps.PercentTimeLimit > 3600 || config.Modules.AntiCaps.PercentTimeLimit < 5)
		config.Modules.AntiCaps.PercentTimeLimit = 10;

	if (config.Modules.AntiLinks.PercentTimeLimit < 5 || config.Modules.AntiLinks.PercentTimeLimit > 3600)
		config.Modules.AntiLinks.PercentTimeLimit = 10;

	if (config.Modules.Automod.Words.length > 20) config.Modules.Automod.Words.splice(20, 1);
	for (let word in config.Modules.Automod.Words) {
		if (config.Modules.Automod.Words[word].length > 30) config.Modules.Automod.Words.splice(word, 1);
		if (config.Modules.Automod.Words[word].Percent > 100 || config.Modules.Automod.Words[word].Percent < 10)
			config.Modules.Automod.Words.splice(word, 1);
	}

	return new serverConfigs(config);
};

export { validateAndUpdate };
