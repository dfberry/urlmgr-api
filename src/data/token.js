"use strict"

const db = require('mongoose'),
  loadClass = require('mongoose-class-wrapper'),
  uuid = require('node-uuid');

db.Promise = require('bluebird');

let tokenSchema = new db.Schema({
  token: { type: String, required:true, default: uuid.v1, index: { unique: true } },
  userUuid: {type: String, required:true, ref: 'User'},
  role: {type: String, required:true, defaultValue: 'none'},
  revoked: { type: Boolean, required:true, defaultValue: false },
  created: {type: Date, default: Date.now }
});

class TokenModel {}

// Add methods from class to schema 
tokenSchema.plugin(loadClass, TokenModel);
 
module.exports = db.model('Token', tokenSchema);