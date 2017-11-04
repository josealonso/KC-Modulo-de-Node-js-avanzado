'use strict';

const Usuario = require('../models/Usuario');
const i18n = require('../lib/i18nSetup')();
const jwt = require('jsonwebtoken');

class LoginController {
	index(req, res, next) {
		res.locals.email = 'admin@example.com'; // para que la vista tenga el email
		res.locals.error = '';
    
		res.render('login');
	}

	// POST /login
	async post(req, res, next) {
		const email = req.body.email;
		const password = req.body.password;

		// ciframos la contraseña
		const hashedPassword = Usuario.hashPassword(password);

		const user = await Usuario.findOne({ email: email, password: hashedPassword });

		if (!user) {
			// Mantenemos al usuario en esta página
			res.locals.email = email; // para que la vista tenga el email que me mandó
			res.locals.error = i18n.__('Invalid credentials');
			res.render('login');
			return;
		}

		// el usuario está y coincide la password

		// apuntamos el usuario en la sesión
		req.session.authUser = { _id: user._id };

		// le mandamos a la home
		res.redirect('/');
	}

	// POST /login JWT
	async jwtCreation(req, res, next) {
		const email = req.body.email;
		const password = req.body.password; // Esto se hace en Ajax

		console.log('SERVIDOR en loginController.js ---> El correo es:', email);
		console.log('SERVIDOR en loginController.js ---> La contr. es:', password);
		// hacemos un hash de la password
		const hashedPassword = Usuario.hashPassword(password);

		const user = await Usuario.findOne({ email: email, password: hashedPassword });

		if (!user) {
			// Respondemos que no son válidas las credenciales
			res.json({ ok: false, error: res.locals.error }); //$__'invalid credentials'}); // i18n.__('Invalid credentials');
			return;
		}

		// el usuario está y coincide la password

		// creamos el token_id
		//jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		jwt.sign(
			{ _id: user._id },
			'miclave',
			{
				expiresIn: '2d'
			},
			(err, token_id) => {
				if (err) {
					return next(err);
				}

				// guardamos el JWT en el objeto "localStorage" del navegador --> NO, pq estamos en el servidor !!
				//window.localStorage.setItem('myJWT', token_id);
				console.log('token_id PASADO al navegador:', token_id);
				// respondemos con un JWT
				// res.cookie('auth', token_id); // BIEN
				res.json({ ok: true, token_id: token_id });
				//res.send(token_id);
			}
		);
	}

	logout(req, res, next) {
		delete req.session.authUser;
		req.session.regenerate(function(err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	}
}

module.exports = new LoginController();
