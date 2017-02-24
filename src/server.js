'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    config = require('./config/config.json'),
    urls = require('./routes/urls'),
    users = require('./routes/users'),
    auth = require('./routes/authentication');

// for coverage of apis
var im = require('istanbul-middleware'),
    isCoverageEnabled = (process.env.COVERAGE == "true"); 

if (isCoverageEnabled) {
    console.log('Hook loader for coverage - ensure this is not production!');
    im.hookLoader(__dirname);
        // cover all files except under node_modules 
        // see API for other options 
}

var app = express();

global.name = "help";

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db = 'mongodb://' + config.db.host + ":" + config.db.port + "/" + config.db.db;
mongoose.connect(db);

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());

//http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));

// Attach routes
app.get("/", (req, res) => res.json({message: "Welcome to the app!"}));
app.use('/v1/urls',urls);
app.use('/v1/users',users);
app.use('/v1/auth',auth);

// test/coverage only
if (isCoverageEnabled) {
    //enable coverage endpoints under /coverage 
    app.use('/coverage', im.createHandler());
}

module.exports = app;
