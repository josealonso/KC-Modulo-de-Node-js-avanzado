'use strict';

function crearJWTToken() {
	$.ajax({
		method: 'post',
		url: '/login',
		data: {
			// Valores que se pasan al cuerpo de la petición del servidor (res.body)
			email: $('#email').val(),
			password: $('#password').val()
		},
		success: function(data) {
			// "data" designa al objeto JSON mandado por el servidor
			console.log('Token recibido:', data.token_id);
			localStorage.setItem('token', data.token_id);
		},
		error: function(err) {
			console.log('Error:', err);
		}
	});
}

function getRequestToTheAPI() {
	let token = localStorage.getItem('token');
	$.ajax({
		method: 'get',
		url: '/apiv1/anuncios',
		data: {
			// Valores que se pasan al cuerpo de la petición del servidor (req.body)
		},
		headers: { 'x-access-token': token },
		// Valores que se pasan a la cabecera de la petición del servidor (req.headers)
		success: function(data) {
			// "data" designa al objeto JSON mandado por el servidor
			console.log('DATOS recibidos:', data._id);
		},
		error: function(err) {
			console.log('Error:', err);
		}
	});
}

$(document).ready(function() {
	// Esta línea es imprescindible !!!
	// document.getElementById('prueba').addEventListener('click', function() {
	$('#login').on('click', function() {
		crearJWTToken();
	});

	let token = localStorage.getItem('token');
	$.ajax({
		method: 'get',
		url: '/apiv1/anuncios',
		data: {
			// Valores que se pasan al cuerpo de la petición del servidor (req.body)
		},
		headers: { 'x-access-token': localStorage.getItem('token') },  // token },
		// Valores que se pasan a la cabecera de la petición del servidor (req.headers)
		success: function(data) {
			// "data" designa al objeto JSON mandado por el servidor
			console.log('DATOS recibidos:', data._id);
		},
		error: function(err) {
			console.log('Error:', err);
		}
	});

	/*$(document).on('readystatechange', function() {
		console.log('Dirección cambiada !!');
	});*/
});
