'use strict';

const connectionPromise = require('./connectAMQP');
const Jimp = require('jimp');

const q = 'q3';

// Consumidor
// IIFE Inmediatelly Invoked Function Expression
(async () => {
	// nos aseguramos de que está conectado
	const conn = await connectionPromise;

	// conectarnos a un canal
	const ch2 = await conn.createChannel();

	// conecto a una cola
	await ch2.assertQueue(q, { durable: false });

	// le decimos a rabbitMQ cuántos mensaje puede darme en paralelo
	ch2.prefetch(1);

	await ch2.consume(q, function(msg) {
		let photo = msg.content.toString();
		console.log('Consumidor:', photo);
		// procesamos el mensaje
		Jimp.read(photo)
			.then(function(photo) {
				photo
					.resize(100, 100) // resize
					.quality(60) // set JPEG quality
					.write('thumbnail.jpg'); // save
				// confirmamos a rabbit que está procesado
				ch2.ack(msg); // ch2.nack(msh)
			})
			.catch(function(err) {
				console.error(err);
			}); 
	}); 
})();
