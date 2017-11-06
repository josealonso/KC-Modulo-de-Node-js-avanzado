'use strict';

const connectionPromise = require('./connectAMQP');

const q = 'q3';

// Publicador
// IIFE Inmediatelly Invoked Function Expression
(async () => {
	// nos aseguramos de que está conectado
	const conn = await connectionPromise;

	// conectarnos a un canal
	const ch2 = await conn.createChannel();

	// conecto a una cola
	await ch2.assertQueue(q, {
        // auto_delete: true,
		durable: false // NO sobrevive a reinicios
	});

	// maximo teórico del tamaño de un mensaje:
	// 9,223,372,036,854,775,807 B

	//setInterval(() => {
	//const mensaje = {
	// const directorio = 'home/jose/1-KeepCoding/Proyecto-articulos/src/img/';
	const rutaFoto = '/home/jose/1-KeepCoding/Proyecto-articulos/src/img/libro1.jpg';
	//};
	// mandar mensaje
	// const res = ch.sendToQueue(q, new Buffer(JSON.stringify(mensaje)), {
	const res = ch2.sendToQueue(q, new Buffer(rutaFoto), {
		// persistent: true // para sobrevivir a reinicios
	});
	console.log(`enviado: ${rutaFoto} ${res}`);
})().catch((err) => console.error(err));
