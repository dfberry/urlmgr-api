'use strict';

var app = require('./server')(),
    http = require('http'),
    port = process.env.SB_PORT || 3000,
    host = process.env.SB_HOST || undefined,
    server; 

server = http.createServer(app);

// Start Server
server.listen(port, host, function() {
});
