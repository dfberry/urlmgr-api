'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    config = require('./config/config.json'),
    urls = require('./routes/urls'),
    users = require('./routes/users'),
    auth = require('./routes/authentication');

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

module.exports = app;
