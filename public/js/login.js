'use strict';

function crearJWTToken() {
	$.ajax({
		method: 'post',
		url: '/api/authenticate',
		data: {
			// Valores que se pasan al cuerpo de la petición del servidor (res.body)
			user: $('#user').val()
		},
		success: function(data) {
			// "data" designa al objeto JSON enviado por el servidor
			console.log('Hola, soy el cliente');
			console.log('Token recibido:', data.token_id);
			localStorage.setItem('token2', data.token_id);
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
		url: '/api/anuncios',
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
	$('#API-login').on('click', function() {
		crearJWTToken();
	});

	let token = localStorage.getItem('token');
	// JR Duda: qué evento está asociado a esta función ajax
	/*$.ajax({
		method: 'get',
		url: '/api/anuncios',
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
	}); */

	/*$(document).on('readystatechange', function() {
		console.log('Dirección cambiada !!');
	});*/
});
