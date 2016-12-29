var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 1080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var config = {
    server: ip,
    server_port: port,
    password: "XfcU8n!",
    timeout: 300,
    method: "aes-128-cfb"
}

var ssserver = require("./ssserver");

ssserver.run(config);