//var config = {};

//config.server = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
//config.server_port = process.env.OPENSHIFT_NODEJS_PORT || 1080;
//config.password = process.env.OPENSHIFT_NODEJS_PASSWD || "123456";
//config.timeout = process.env.OPENSHIFT_NODEJS_TIMEO || 300;
//config.method = process.env.OPENSHIFT_NODEJS_IP || "aes-128-cfb";

//var ssserver = require("./ssserver");

//ssserver.run(config);

var http = require('http');
var https = require('https');
var url = require('url');
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var DEBUG_TRACE = true;

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
        var request_url = req.url;
        if(!request_url) {
        	return res.end('must have url!');
        } else {
			log.i("> " + request_url);
        }
		log.d("headers:");
		log.d(req.headers);

        var option = url.parse(request_url);

		log.d("url parse result:");
		log.d(option);

        req.headers.host = option.host;
        option.path = option.path ? option.path : option.pathname + (option.search ? option.search : '');
        req.headers.path = option.path;
        option.method = req.method;
        option.headers = req.headers;

		log.d("proxy options:");
		log.d(option);

        var httpObj = 'http:' == option.protocol ? http : https;
        httpObj.request(option, function(result) {
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