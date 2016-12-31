var net = require('net'),
    http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy');

var NET_PORT = 8088;
var HTTP_PORT = 8081;
var HTTPS_PORT = 8082;

var SERVER_HOST = "127.0.0.1";
var SERVER_URL = "http://" + SERVER_HOST + ":8080";

var proxy = httpProxy.createProxyServer({});

// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//     console.log("GET request: " + req.url);
//     proxyReq.setHeader('X-Target-Url', req.url);
// });

http.createServer(function(req, res) {
    console.log("HTTP: " + req.url);
    var url = req.url;
    var host = req.headers.host;
    req.headers.host = SERVER_HOST;
    req.headers['X-Target-Url'] = url;
    req.url = SERVER_URL;
    proxy.web(req, res, { target: SERVER_URL });
}).listen(HTTP_PORT);
console.log("HTTP Listen " + HTTP_PORT);

https.createServer(function(req, res) {
    console.log("HTTPS: " + req.url);
    var url = req.url;
    var host = req.headers.host;
    req.headers.host = SERVER_HOST;
    req.headers['X-Target-Url'] = url;
    req.url = SERVER_URL;
    proxy.web(req, res, { target: SERVER_URL });
}).listen(HTTPS_PORT);

console.log("HTTPS Listen " + HTTPS_PORT);

net.createServer(function(socket){
    socket.once('data', function(buf){
        console.log(buf.toString('utf-8'));
        console.log(buf[0]);
        var address = buf[0] === 67 ? HTTPS_PORT : HTTP_PORT;
        var proxy = net.createConnection(address, function() {
            proxy.write(buf);
            socket.pipe(proxy).pipe(socket);
        });
        
        proxy.on('error', function(err) {
            console.log(err);
        });
    });
    
    socket.on('error', function(err) {
        console.log(err);
    });
}).listen(NET_PORT);
console.log("HTTP/HTTPS Listen " + NET_PORT);
