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
	log.i("GET request: " + req.url)
    var body = '';
    req.on('data', function(chunk) {
    	body += chunk;
    });
    req.on('end', function() {
        var targeturl = req.headers['x-target-url'];

        if(!targeturl) return res.send("must have targeturl");
		log.i("> " + targeturl);

		log.d("headers:");
		log.d(req.headers);

        var option = url.parse(targeturl);
        option.method = req.method;
        delete req.headers.host;
        delete req.headers.hostname;
        delete req.headers['x-target-url'];
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