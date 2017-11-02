'use strict';

//const mongoose = require('mongoose');
const readLine = require('readline');
//const async = require('async');
//require('./lib/i18nSetup');

const conn = require('./lib/connectMongoose');
const Usuario = require('./models/Usuario');   // Cargamos las definiciones de todos nuestros modelos

conn.once('open', async function() {
  // uso try/catch para cazar los errores de async/await
  try {
    
    await initUsuarios();
    // otros inits ...
    conn.close();
    
  } catch(err) {
    console.log('Hubo un error:', err);
    process.exit(1);
  }
});

async function initUsuarios() {
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.result.n} usuarios.`);

  const inserted = await Usuario.insertMany([
    { name: 'admin', 
      email: 'admin@example.com',
      password: Usuario.hashPassword('1234') }
  ]);
  console.log(`Insertados ${inserted.length} usuarios.`);
}



/*conn.once('open', async function () {

  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Are you sure you want to empty conn? (no) ', function (answer) {
    rl.close();
    if (answer.toLowerCase() === 'yes') {
      runInstallScript();
    } else {
      console.log('conn install aborted!');
      return process.exit(0);
    }
  });

});

function runInstallScript() {

  async.series([
      initAnuncios
    ], (err) => {
      if (err) {
        console.error( __('generic', { err }) );
        return process.exit(1);
      }

      return process.exit(0);
    }
  );

}

function initAnuncios(cb) {
  const Anuncio = mongoose.model('Anuncio');

  Anuncio.remove({}, ()=> {

    console.log('Anuncios borrados.');

    // Cargar anuncios.json
    const fichero = './anuncios.json';
    console.log('Cargando ' + fichero + '...');

    Anuncio.cargaJson(fichero, (err, numLoaded)=> {
      if (err) return cb(err);

      console.log(`Se han cargado ${numLoaded} anuncios.`);
      return cb(null, numLoaded);
    });

  }); */

