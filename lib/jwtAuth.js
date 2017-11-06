'use strict';

const jwt = require('jsonwebtoken');

module.exports = function(token) {
	// devuelve un middleware que si no hay usuario responde con error
	return function(req, res, next) {
		// let existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWZhNTc5OWNhNmRhOTMxMjY5OTQ2YzMiLCJpYXQiOjE1MDk3NTQ5MTgsImV4cCI6MTUwOTkyNzcxOH0.M4sxOv2RLFq4rVMqW3ys3lGdUnd33ay1auD6FzP-yD4';
		// req.header('x-access-token');
		let existingToken = req.session.jwtToken;
		// res.setHeader('Acces-Control-Allow-Headers', 'x-access-token, mytoken');
		let token = existingToken || req.body.token || req.query.token || req.get('x-access-token');
		res.setHeader('x-access-token', token);
		console.log('Token q usaremos:', token);

		if (!token) {
			const err = new Error('no token provided');
			next(err);
			return;
		}

		// tengo token
		// jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		jwt.verify(token, 'miClave', (err, decoded) => {
			if (err) {
				return next(err);
			}
			// guardo el id del usuario en request para que
			// los siguientes middlewares puedan usarlo
			// res.json(decoded);

			console.log('Token correcto-1111111', req.session.jwtToken);
			req.userId = decoded._id;
			console.log('Token correcto', decoded._id);
			// el usuario está autenticado
			next();
			// if everything is good, save to request for use in other routes
			// req.decoded = decoded;
		});
	};
};
