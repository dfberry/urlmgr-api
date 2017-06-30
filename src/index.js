'use strict';

const app = require('./server'),
    http = require('http'),
    port = process.env.SB_PORT || app.get('port'),
    host = process.env.SB_HOST || "0.0.0.0"; 

let server = http.createServer(app);

// Start Server
server.listen(port, host, function() {
    console.log("app started on host=" + host + ", port=" + port);
});
