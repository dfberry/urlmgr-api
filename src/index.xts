import * as http from 'http';
import * as app from './server';


let port = process.env.SB_PORT || app.get('port'),
    host = process.env.SB_HOST || "0.0.0.0",
    server: http.Server; 

server = http.createServer(app);

// Start Server
server.listen(port, host, function() {
    console.log("app started on host=" + host + ", port=" + port);
});
