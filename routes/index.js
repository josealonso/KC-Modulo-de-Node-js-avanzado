'use strict';

/* GET home page. */ 
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const Anuncio = require('mongoose').model('Anuncio');
//const i18n = require('i18n');
// i18n.init();

const i18n = require('../lib/i18nSetup')();
//i18n('en');

/* GET anuncios page. */
router.get('/', async function(req, res, next) {
	try {
		console.log('       Función de FILTRADO para las vistas!!');
		const start = parseInt(req.query.start) || 0;
		const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
		const sort = req.query.sort || '_id';
		const includeTotal = true;

		const filters = {};
		if (req.query.tag) { 
			filters.tags = req.query.tag;      // JR
		}
		if (req.query.venta) {
			filters.venta = req.query.venta;
		}

		const { total, rows } = await Anuncio.list(filters, start, limit, sort, includeTotal);
		res.render('anuncios', { total, anuncios: rows }); // Original
		// res.render('anuncios', { anuncios: rows });   // JR
	} catch (err) {
		return res.next(err);
	}
});

router.get('/lang/:locale', (req, res, next) => {
  //console.log('LA VISTA TIENE ESTO:', res.locals);
	const locale = req.params.locale;
	console.log('LCambio a ', locale);
  console.log('Dentro de locale. Objeto i18n ---> ', i18n);
  i18n.setLocale(locale);     ///// JR
	const referer = req.query.redir || req.get('referer');
	res.cookie('nodepop-lang', locale, { maxAge: 900000, httpOnly: true });
	res.redirect(referer);
});

module.exports = router;

