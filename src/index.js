'use strict';

var app = require('./server'),
    http = require('http');

let port = process.env.SB_PORT || app.get('port'),
    host = process.env.SB_HOST || undefined,
    server; 

server = http.createServer(app);

// Start Server
server.listen(port, host, function() {
    console.log("app started on host=" + host + ", port=" + port);
});
