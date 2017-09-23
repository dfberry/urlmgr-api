'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    path = require('path'),
    CONFIG = require('./config.js'),
    app = express(),
    memcache = require('memory-cache'),
    v1Routes = require("./routes/v1/route"),
    database = require('./database'),
    libraries = require('./libs/index');

    
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

app.locals.cache = memcache;

app.locals.libraries = libraries;

// get db connection
//app.locals.dbconnection is the db connection
database.connect(CONFIG,app); 

app.set('env', CONFIG.env || 'development');
app.set('port', CONFIG.port || 3000);
app.locals.config = CONFIG;

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.disable('x-powered-by');

//http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));

// V1 API
app.use('/v1/',v1Routes);

// test/coverage only
if ((CONFIG.env === 'development') && isCoverageEnabled) {
    //enable coverage endpoints under /coverage 
    app.use('/coverage', im.createHandler());
}

process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
});

module.exports = app;
