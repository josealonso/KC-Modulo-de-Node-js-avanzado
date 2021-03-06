'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');    // We can get info from POST and/or URL parameters
const session = require('express-session');
const sessionAuth = require('./lib/sessionAuth');
const jwtAuth = require('./lib/jwtAuth');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// Conexión a la base de datos
const db = require('./lib/connectMongoose'); // ??

require('dotenv').config(); // inicializamos variables de entrono desde el fichero .env

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');
require('./models/Usuario');
require('./models/UsuarioDelAPI');

// view engine setup
// Source: https://webapplog.com/jade-handlebars-express/
let helpers = require('./public/hs/helpers');

const app = express();
//let dirName = __dirname;  //.includes('api') ? path.dirname(module.parent.__dirname) : __dirname;

// Load handlebars engine and load our configuration
// from the file hbsconf.js under a libs folder at the same level of the application
const handlebars = require('express-handlebars').create(require('./lib/hbsconf.js'));

//Set our application to use our configured handlebars module as the view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// app.use(logger('dev'));
if (process.env.LOG_FORMAT !== 'nolog') {
	app.use(logger(process.env.LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const i18n = require('./lib/i18nSetup')();
app.use(i18n.init);

// Global Template variables
app.locals.title = 'NodePop';

// Login
const loginController = require('./routes/loginController');
const APILoginController = require('./routes/apiv1/loginController');
 
app.get('/api/authenticate', APILoginController.index);
app.post('/api/authenticate', APILoginController.post);
app.get('/api/logout', APILoginController.logout);

//app.post('/api/authenticate', loginController.APIPost);   //jwtCreation);
//app.use('/api/anuncios', jwtAuth(), require('./routes/apiv1/anuncios'));

// catch API 404 and forward to error handler
// app.use('/api', function (req, res, next) {
app.use('/api', function(req, res, next) {
	const err = new Error(__('not_found'));
	err.status = 404;
	next(err);
});

// middleware de control de sesiones
app.use(
	session({
		name: 'nodepop',
		secret: 'sdhkj fasjfakdfksdajf dkshfkwi32 yir32 iwe',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 2 * 24 * 3600 * 1000 }, // dos dias de inactividad
		store: new MongoStore({
			// url: cadena de conexión
			mongooseConnection: mongoose.connection,
			autoReconnect: true,
			clear_interval: 3600
		})
	})
);


// usamos las rutas de un controlador
app.get('/login', loginController.index);   // Si comenta esta línea, el navegador da error: "TOO_MANY_REDIRECTS" !!
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
 
app.use('/', sessionAuth(), require('./routes/index')); // Ponía sessionAuth, sin paréntesis, y no cargaba ninguna página !!
app.use('/anuncios', require('./routes/index'));
// app.use('/hola', require('./routes/hola').router);

// Web
// app.use('/', require('./routes/anuncios'));
// app.use('/anuncios', require('./routes/anuncios'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error(__('not_found'));
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	if (err.array) {
		// validation error
		err.status = 422;
		const errInfo = err.array({ onlyFirstError: true })[0];
		err.message = isAPI(req)
			? { message: __('not_valid'), errors: err.mapped() }
			: `${__('not_valid')} - ${errInfo.param} ${errInfo.msg}`;
	}

	// establezco el status a la respuesta
	err.status = err.status || 500;
	res.status(err.status);

	// si es un 500 lo pinto en el log
	if (err.status && err.status >= 500) console.error(err);

	// si es una petición al API respondo JSON...
	if (isAPI(req)) {
		res.json({ success: false, error: 'Petición al API. ' + err.message });
		return;
	}

	// ...y si no respondo con HTML...

	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.render('error');
});

function isAPI(req) {
	return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
