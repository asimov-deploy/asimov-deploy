module.exports = function(server, secure) {

	var config = require('./config.js');
	var agentCommand = require('./agent-command.js');
	var restify = require("restify");
	var _  = require("underscore");


	server.get("/loadbalancer/listHosts", function(req, res) {

		var client = restify.createJsonClient({ url: config.agents[0].url });

		client.get('/loadbalancer/listHosts', function(err, req, agentResp, hostList) {
			if (!hostList)
				return res.json({});

			hostList.forEach(function(host) {
				config.loadBalancerStatusChanged(host.id, host.enabled);
			});

			var filtered = _.filter(hostList, function(host) {
				return config.getAgent({loadBalancerId: host.id});
			});

			res.json(filtered);
		});

	});

	server.post("/loadbalancer/change", secure,  function(req, res) {
		res.json('ok');

		agentCommand.send(config.agents[0].name, '/loadbalancer/change', req.body);
	});

	server.post("/loadbalancer/settings", secure, function(req, res) {
		res.json('ok');

		agentCommand.send(config.agents[0].name, '/loadbalancer/settings', req.body);

	});

};