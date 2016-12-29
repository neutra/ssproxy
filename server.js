//var config = {};

//config.server = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
//config.server_port = process.env.OPENSHIFT_NODEJS_PORT || 1080;
//config.password = process.env.OPENSHIFT_NODEJS_PASSWD || "123456";
//config.timeout = process.env.OPENSHIFT_NODEJS_TIMEO || 300;
//config.method = process.env.OPENSHIFT_NODEJS_IP || "aes-128-cfb";

//var ssserver = require("./ssserver");

//ssserver.run(config);

var http=require('http');
var https=require('https');
var url=require('url');
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

http.createServer(function(req,res){
    var body='';
    req.on('data',function(chunk){
            body+=chunk;
    });
    req.on('end',function(){
			console.log("> "+req.url);

            if(!req.url) return res.end('must have url!');
            var request_url=req.url;
            var option=url.parse(request_url);
            var httpObj='http:'==option.protocol?http:https;

            req.headers.host=option.host;
            option.path=option.path?option.path:option.pathname+(option.search?option.search:'');//cloudfrondry上 url.parse 后 没有path这个下标
            req.headers.path=option.path;
            delete req.headers.fetchurl;
            option.method=req.method;
            option.headers=req.headers;
            httpObj.request(option,function(result){
                for(var key in result.headers){
                    res.setHeader(key,result.headers[key]);
                }
                result.on('data',function(chunk){
                    res.write(chunk);
                });
                result.on('end',function(){
                    res.end();
                });
            }).on('error',function(error){
                res.end('remote http.request error'+error)}).end(body);

    });
}).listen(port);
console.log("listen: "+port);