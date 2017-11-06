'use strict';

const UsuarioDelAPI = require('../../models/UsuarioDelAPI');
const i18n = require('../../lib/i18nSetup')();
const jwt = require('jsonwebtoken');

class LoginController {
	// GET /api/authenticate
	index(req, res, next) {
		res.locals.user = ''; // para que la vista tenga el nombre de usuario
		res.locals.error = '';
		res.render('APILogin');
	}

	// POST /api/authenticate
	async post(req, res, next) {
		// async jwtCreation(req, res, next) {
		const userName = req.body.user; // Esto se hace en Ajax

		console.log('SERVIDOR en loginController.js ---> El usuario es:', userName);

		// const user = await UsuarioDelAPI.findOne({ user: userName });

		// Creamos el JWT token
		//jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		jwt.sign(
			{ _id: userName._id }, // user._id },
			'miclave',    // Clave del servidor
			{
				expiresIn: '2d'
			},
			(err, token_id) => {
				if (err) {
					return next(err);
				}

				//window.localStorage.setItem('myJWT', token_id);
				console.log('token_id PASADO al navegador:', token_id);
				// respondemos con un JWT
				//req.session.jwtToken = token_id;
				res.setHeader('x-access-token', token_id);
				res.json({ ok: true, token_id: token_id });
				// res.send(token_id);
				
				
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
} // End of the class

module.exports = new LoginController();
