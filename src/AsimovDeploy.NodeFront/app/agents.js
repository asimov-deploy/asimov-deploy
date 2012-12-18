module.exports = function(server, secure) {

	var config = require('./config.js');
	var agentCommand = require('./agent-command.js');
	var restify = require("restify");

	server.get("/agents/list", function(req, res) {

		var agentsResp = [];

		config.agents.forEach(function(agent) {

			agentsResp.push({
				name: agent.name,
				dead: agent.dead,
				version: agent.version,
				configVersion: agent.configVersion,
				loadBalancerId: agent.loadBalancerId
			});

		});

		res.json(agentsResp);

	});

	server.post("/agent/heartbeat", function(req, res) {
		res.json('ok');

		var agent = config.getAgent({ name: req.body.name });
		if (!agent) {
			agent = { name: req.body.name };
			config.agents.push(agent);
		}

		agent.url = req.body.url;
		agent.lastHeartBeat = new Date();
		agent.apiKey = req.body.apiKey;
		agent.dead = false;
		agent.version = req.body.version;
		agent.configVersion = req.body.configVersion;
		agent.loadBalancerId = req.body.loadBalancerId;

	});

	server.post("/agent/event", function(req, res) {
		res.json("ok");

		clientSockets.sockets.volatile.emit('agent:event', req.body);

		if (req.body.eventName == "loadBalancerStateChanged") {
			config.loadBalancerStatusChanged(req.body.id, req.body.enabled);
		}
	});

	server.post("/agent/log", function(req, res) {
		res.json("ok");
		clientSockets.sockets.volatile.emit('agent:log', req.body);
	});

	server.post("/deploy/deploy", secure, function(req, res) {
		res.json('ok');

		agentCommand.send(req.body.agentName, '/deploy/deploy', req.body);
	});

	server.post("/deploy/verify", secure, function(req, res) {
		res.json('ok');

		agentCommand.send(req.body.agentName, '/deploy/verify', req.body);
	});


	server.get("/agent/query", function(req, res) {
		var agent =  config.getAgent({ name: req.query.agentName });
		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });
		var agentQueryUrl = req.query.url;

		client.get(agentQueryUrl, function(err, req, _, data) {
				if (err) {
					res.json([]);
					console.log(err);
					return;
				}

				res.json(data);
		});

	});

};