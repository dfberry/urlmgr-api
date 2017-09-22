'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let mongooseOptions = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
}; 

const Database = {
  
  connect: function (config, app){
    debugger;
    try{
      let db = 'mongodb://' + config.db.host + ":" + config.db.port + "/" + config.db.db;
      mongoose.connect(db, mongooseOptions);

      // Log database events to the console for debugging purposes
      mongoose.connection.on('open', function () {  
        console.log("Mongoose open event"); 
      });
      mongoose.connection.on('close', function () {  
        console.log("Mongoose close event"); 
      });
      mongoose.connection.on('connected', function () {  
        console.log("Mongoose connected event");  
      
        var admin = new mongoose.mongo.Admin(mongoose.connection.db);
        admin.buildInfo(function (err, info) {
          let mongoVersion = info.version;
          app.set('ver-mongo', mongoVersion || undefined);
          app.locals.dbconnection = mongoose.connection.db;
          app.locals.container = config.db.db;
        });
      }); 
      mongoose.connection.on('disconnected', function () {  
        console.log("Mongoose disconnected event"); 
      });
      mongoose.connection.on('error',function (err) {  
        console.log("Mongoose error event:");
        console.log(err);
        process.exit(1);
      });  
    }catch(err){
      console.log("mongoose connection failure " + err);
      process.exit(1);
    }  
  }
};

module.exports = Database;
