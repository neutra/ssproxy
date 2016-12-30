var http = require('http'),
    httpProxy = require('http-proxy');

var PORT = 8088;
var SERVER_HOST = "127.0.0.1";
var SERVER_URL = "http://" + SERVER_HOST + ":8080";

var proxy = httpProxy.createProxyServer({});
// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//     console.log("GET request: " + req.url);
//     proxyReq.setHeader('X-Target-Url', req.url);
// });
http.createServer(function(req, res) {
    console.log("GET request: " + req.url);
    var url = req.url;
    var host = req.headers.host;
    req.headers.host = SERVER_HOST;
    req.headers['X-Target-Url'] = url;
    req.url = SERVER_URL;
    proxy.web(req, res, { target: SERVER_URL });
}).listen(PORT);

console.log("Listen " + PORT);