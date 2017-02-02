const config = require('../config/config.json');
const mongoose = require('mongoose'); 
 
mongoose.Promise = require('bluebird');
const loadClass = require('mongoose-class-wrapper');

mongoose.connect('mongodb://' + config.db.host + ":" + config.db.port + "/" + config.db.db);

var urlSchema = new mongoose.Schema({
  url: {type: String},
  created: {type: Date, default: Date.now}
});

class UrlModel {
}
 
// Add methods from class to schema 
urlSchema.plugin(loadClass, UrlModel);
 
module.exports = mongoose.model('Url', urlSchema);