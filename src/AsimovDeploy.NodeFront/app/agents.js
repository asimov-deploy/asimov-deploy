/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

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

		res.json('ok');
	});

	server.post("/agent/event", function(req, res) {
		clientSockets.sockets.volatile.emit('agent:event', req.body);

		if (req.body.eventName == "loadBalancerStateChanged") {
			config.loadBalancerStatusChanged(req.body.id, req.body.enabled);
		}

		res.json("ok");
	});

	server.post("/agent/log", function(req, res) {
		clientSockets.sockets.volatile.emit('agent:log', req.body);

		res.json("ok");
	});

	server.post("/deploy/deploy", secure, function(req, res) {
		agentCommand.send(req.body.agentName, '/deploy/deploy', req.body);
		res.json('ok');
	});

	server.post("/agent/action", secure, function(req, res) {
		agentCommand.send(req.body.agentName, '/action', req.body);
		res.json('ok');
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