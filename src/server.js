'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    path = require('path'),
    config = require('./config/config.json'),
    urls = require('./routes/urls'),
    users = require('./routes/users'),
    libClaims = require('./libs/claims'),
    libMeta = require('./libs/meta'),
    libResponse = require('./libs/response'),
    meta = require('./routes/meta'),
    auth = require('./routes/authentication');

// for coverage of apis
var im = undefined, 
    isCoverageEnabled = false;

if (config.env === 'development'){
    isCoverageEnabled = (process.env.COVERAGE == "true"); 

    if (isCoverageEnabled) {
        im = require('istanbul-middleware'),
        console.log('Hook loader for coverage - ensure this is not production!');
        im.hookLoader(__dirname);
            // cover all files except under node_modules 
            // see API for other options 
    }
}

var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var mongooseOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; 
var db = 'mongodb://' + config.db.host + ":" + config.db.port + "/" + config.db.db;
mongoose.connect(db, mongooseOptions);


app.set('env', config.env || 'development');
app.set('port', config.port || 3000);
app.locals.container = config.db.db;

console.log("environment = " + config.env);

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));
app.use(libClaims);

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
if ((config.env === 'development') && isCoverageEnabled) {
    //enable coverage endpoints under /coverage 
    app.use('/coverage', im.createHandler());
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);  
});

// error handlers
app.use(function (err, req, res, next) {

  let errorStack = (app.get('env') === 'development') ? err : {};

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
        message : err.message,
        error: errorStack
    });
  } else if (err.message.indexOf("AuthFailure") >= 0){
    res.status(422).json({
        message: err.message,
        error: errorStack
    });
  } else 
    next(err);
});


module.exports = app;
