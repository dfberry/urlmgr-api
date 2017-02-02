'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    config = require('./config/config.json'),
    urls = require('./routes/urls');

var app = express();

// Attach middleware
app.use(require('morgan')('combined'));
app.use(cors());

//http://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));

// Attach routes
app.get("/", (req, res) => res.json({message: "Welcome to the app!"}));
app.use('/v1/urls',urls);
app.listen(config.port);

module.exports = app;
