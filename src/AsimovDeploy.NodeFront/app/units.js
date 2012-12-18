var config = require('./config.js');
var async = require('async');
var restify = require("restify");

module.exports = function(server) {

	server.get("/units/list", function(req, res) {

		var agentsResp = [];

		async.forEach(config.agents, function(agent, done) {
			if (agent.dead) {
				done();
				return;
			}

			var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });

			client.get('/units/list', function(err, req, _, units) {
				if (err) {
					agent.dead = true;
					done();
					return;
				}

				agentsResp.push({
						name: agent.name,
						loadBalancerEnabled: agent.loadBalancerEnabled,
						loadBalancerId: agent.loadBalancerId,
						units: units
				});

				done();
			});

		}, function() {
			res.json(agentsResp);
		});

	});

	server.get("/units/:unitName/deployParameters", function(req, res) {


	});

};