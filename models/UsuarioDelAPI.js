'use strict';

const mongoose = require('mongoose');
// var hash = require('hash.js')

const usuarioSchema = mongoose.Schema({
  user: String,
});

/*usuarioSchema.statics.hashPassword = function(plain) {
  return hash.sha256().update(plain).digest('hex');
}   */

var UsuarioDelAPI = mongoose.model('UsuarioDelAPI', usuarioSchema);

module.exports = UsuarioDelAPI;
