var config = {};

config.server = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
config.server_port = process.env.OPENSHIFT_NODEJS_PORT || 1080;
config.password = process.env.OPENSHIFT_NODEJS_PASSWD || "123456";
config.timeout = process.env.OPENSHIFT_NODEJS_TIMEO || 300;
config.method = process.env.OPENSHIFT_NODEJS_IP || "aes-128-cfb";

var ssserver = require("./ssserver");

ssserver.run(config);