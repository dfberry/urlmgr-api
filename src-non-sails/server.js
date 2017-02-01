'use strict';


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var favicon = require('serve-favicon');


var urls = require('./routes/urls');

module.exports = function() {

    var app = express();

    // Attach middleware
    app.use(require('morgan')('combined'));
    app.use(cors());

    //http://stackoverflow.com/questions/19917401/error-request-entity-too-large
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));
    
    // Attach routes
    app.use('/v1/urls',urls);

    return app;
};
