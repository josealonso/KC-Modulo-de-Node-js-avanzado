const i18n = require('i18n');
const path = require('path');

// registrar lenguajes
module.exports = function(defaultLocale) {
	defaultLocale = defaultLocale || process.env.NODE_LANG || 'es';
	i18n.configure({
		directory: path.join(__dirname, '..', 'locales'),
		locales: [ 'en', 'es' ],
		defaultLocale: defaultLocale,
		autoReload: true,
		syncFiles: true,
		queryParameter: 'lang',
		cookie: 'nodepop-lang',
		register: global
	});
	i18n.setLocale(defaultLocale);
	return i18n;
};

// module.exports = i18n;
