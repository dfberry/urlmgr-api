'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    path = require('path'),
np    CONFIG = require('./config.js'),
    urls = require('./routes/urls'),
    users = require('./routes/users'),
    libClaims = require('./libs/claims'),
    libMeta = require('./libs/meta'),
    libResponse = require('./libs/response'),
    meta = require('./routes/meta'),
    auth = require('./routes/authentication'),
    libError = require('./routes/errors'),
    _ = require('underscore'),
    app = express(),
    mongoose = require('mongoose');

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


mongoose.Promise = require('bluebird');

let mongooseOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; 
let db = 'mongodb://' + CONFIG.db.host + ":" + CONFIG.db.port + "/" + CONFIG.db.db;
mongoose.connect(db, mongooseOptions);


app.set('env', CONFIG.env || 'development');
app.set('port', CONFIG.port || 3000);
app.locals.container = CONFIG.db.db;

console.log("environment = " + CONFIG.env);

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

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
app.use('/v1/urls',urls);
app.use('/v1/users',users);
app.use('/v1/auth',auth);
app.use('/v1/meta', meta);

// test/coverage only
if ((CONFIG.env === 'development') && isCoverageEnabled) {
    //enable coverage endpoints under /coverage 
    app.use('/coverage', im.createHandler());
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);  
});

// catch all error handlers
app.use(libError);

module.exports = app;
