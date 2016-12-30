var http = require('http');
var url = require('url');
var port = 8088;

var DEBUG_TRACE = true;
var SERVER_HOST = "http://127.0.0.1:8080/";

var log = {
	i: function(msg) {
		console.log(msg);
	},
	d: function(msg) {
		if(DEBUG_TRACE) console.log(msg);
	}
};

http.createServer(function(req, res) {
    var body = '';
    req.on('data', function(chunk) {
    	body += chunk;
    });
    req.on('end', function() {
        var targeturl = req.url;
		log.i("> " + targeturl);

        var option = url.parse(SERVER_HOST);
        option.method = req.method;
        option.headers = req.headers;
        option.headers.targeturl = targeturl;

		log.d("proxy options:");
		log.d(option);

        http.request(option, function(result) {
            for(var key in result.headers) {
                res.setHeader(key, result.headers[key]);
            }
            result.on('data', function(chunk) {
                res.write(chunk);
            });
            result.on('end', function() {
                res.end();
            });
        }).on('error', function(error) {
            res.end('remote http.request error ' + error)}).end(body);

    	});
	}).listen(port);

log.i("listen: " + port);