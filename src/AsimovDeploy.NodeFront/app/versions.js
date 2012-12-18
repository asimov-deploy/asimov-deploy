var config = require('./config.js');
var async = require('async');
var restify = require("restify");
var querystring = require("querystring");

module.exports = function(server) {

	server.get('/deploylog/file', function(req, res) {

		var agent =  config.getAgent({ name: req.query.agentName });
		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });
		var unitName = querystring.escape(req.query.unitName);

		res.redirect(agent.url + '/deploylog/file/' + unitName + "/" + req.query.position);

	});

};