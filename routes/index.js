'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
// const i18n = require('i18n');

/* GET home page. */ 
router.get('/', async function (req, res, next) {
  try {
    const filename = path.join(__dirname, '../README.md');
    const readme = await new Promise((res, rej) => 
      fs.readFile(filename, 'utf8', (err, data) => err ? rej(err) : res(data) )
    );
    res.render('index', { readme });
  } catch (err) { return next(err); }
});

router.get('/lang/:locale', (req, res, next) => {
  // console.log('LA VISTA TIENE ESTO:', res.locals);
	const locale = req.params.locale;
  console.log('RRR-Cambio a ', locale);
	const referer = req.query.redir || req.get('referer');
  console.log('RRR-la pág. actual es: ', referer);
	res.cookie('nodepop-lang', locale, { maxAge: 900000, httpOnly: true });
	res.redirect(referer);
});


module.exports = router;
