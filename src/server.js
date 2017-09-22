'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    path = require('path'),
    CONFIG = require('./config.js'),
    libClaims = require('./libs/claims'),
    libResponse = require('./libs/response'),
    libError = require('./errors.js'),
    app = express(),
    memcache = require('memory-cache'),
    v1Routes = require("./routes/v1/route"),
    database = require('./database');
    /*,
    mongoose = require('mongoose');
*/
// for coverage of apis
let im = undefined, 
    isCoverageEnabled = false;

if (CONFIG.env === 'development'){
    isCoverageEnabled = (process.env.COVERAGE == "true"); 

    if (isCoverageEnabled) {
        im = require('istanbul-middleware'),
        console.log('Hook loader for coverage - ensure this is not production!');
        im.hookLoader(__dirname);
            // cover all files except under node_modules 
            // see API for other options 
    }
}


//mongoose.Promise = require('bluebird');
app.locals.cache = memcache;

let preRouteError = "";
database.connect(CONFIG,app); //app.locals.dbconnection is the db connection
/*
let mongooseOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
            replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; 
let db = 'mongodb://' + CONFIG.db.host + ":" + CONFIG.db.port + "/" + CONFIG.db.db;
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
     app.locals.db = mongoose.connection.db;
     app.locals.container = CONFIG.db.db;
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
*/

app.set('env', CONFIG.env || 'development');
app.set('port', CONFIG.port || 3000);




// milliseconds
let oneMinute = 60000;
CONFIG.cacheTimeMs = 10 * oneMinute; // 10 minute cache
app.locals.config = CONFIG;

console.log(CONFIG);

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.disable('x-powered-by');

//http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));
app.use(libClaims);

app.use(function(req, res, next) {
  console.log('method %s url %s path %s', req.method, req.url, req.path);
  next();
});

// Attach routes
app.get("/", (req, res) => {
    libResponse.buildResponseSuccess(req, { route: 'root'}, {}, {}).then(response => {
        res.json(response);
    }).catch(err => {
        res.json({error: err});
    });
});
app.use('/v1/',v1Routes);

// test/coverage only
if ((CONFIG.env === 'development') && isCoverageEnabled) {
    //enable coverage endpoints under /coverage 
    app.use('/coverage', im.createHandler());
}

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
app.use(logErrors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);  
});

// catch all error handlers
app.use(libError);


app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! ' + JSON.stringify(err))
})

process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
});

module.exports = app;
