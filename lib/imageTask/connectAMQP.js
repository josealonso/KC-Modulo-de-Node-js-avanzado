'use strict';

const amqplib = require('amqplib'); // 'amqplib/callback_api' 

const url = process.env.AMQP_URL || 'amqp://phqngbng:aOgtp4FzQZLRbtfR7mOv5ZmLRwZcviBq@rhino.rmq.cloudamqp.com/phqngbng';

const connectionPromise = amqplib.connect(url)
.catch(err => {
  console.log('[AMQP]', err);
});

module.exports = connectionPromise;
