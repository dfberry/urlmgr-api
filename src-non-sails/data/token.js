const db = require('mongoose');
const loadClass = require('mongoose-class-wrapper');
const uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
var config = require('../config/config.json');

db.Promise = require('bluebird');

var tokenSchema = new db.Schema({
  token: { type: String, default: uuid.v1, index: { unique: true } },
  userUuid: {type: String, ref: 'User'},
  role: {type: String, defaultValue: 'none'},
  revoked: { type: Boolean, defaultValue: false },
  created: {type: Date, default: Date.now }
});

class TokenModel {}

// Add methods from class to schema 
tokenSchema.plugin(loadClass, TokenModel);
 
module.exports = db.model('Token', tokenSchema);