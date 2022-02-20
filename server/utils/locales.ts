import locale from 'locale';

const supportedLangs: any = {
	supported: ['es_US', 'en_US'],
	es: require('../../locales/es_US.json'),
	en: require('../../locales/en_US.json'),
};

const getLang = (header: string | undefined) => {
	if (!header) return;
	
	const supported = new locale.Locales(supportedLangs.supported);
	const locales = new locale.Locales(header);
	let bestMatch = locales.best(supported);

	return supportedLangs[bestMatch.language.toString()];
};

export default getLang;
