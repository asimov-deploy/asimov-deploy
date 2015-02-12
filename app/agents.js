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

module.exports = function(app, config) {

	var _ = require('underscore');
	var agentApiClient = require('./services/agent-api-client').create(config);
	var deployLifecycleClient = require('./services/deploy-lifecycle-client').create(config);

	app.get("/agents/list", app.ensureLoggedIn, function(req, res) {
		var agentsResp = [];

		config.agents.forEach(function(agent) {
			agentsResp.push({
				name: agent.name,
				group: agent.group,
				dead: agent.dead,
				version: agent.version,
				configVersion: agent.configVersion,
				loadBalancerState: agent.loadBalancerState
			});
		});

		agentsResp = _.sortBy(agentsResp);
		res.json(agentsResp);
	});

	function handleNewLoadBalancerState(agent, newState) {
		var prevState = agent.loadBalancerState;
		agent.loadBalancerState = newState;

		if (!prevState || !newState) {
			return;
		}

		var stateDiff = newState.enabled !== prevState.enabled;
		var connDiff = Math.abs(newState.connectionCount - prevState.connectionCount);
		if (stateDiff || connDiff > 0) {
			clientSockets.sockets.volatile.emit('agent:event', {
				eventName: 'loadBalancerStateChanged',
				agentName: agent.name,
				state: newState
			});
		}
	}

	app.post("/agent/heartbeat", function(req, res) {

		var agent = config.getAgent(req.body.name);
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
		agent.group = req.body.group;

		handleNewLoadBalancerState(agent, req.body.loadBalancerState);

		res.json('ok');
	});

	app.post("/agent/event", function(req, res) {
		clientSockets.sockets.volatile.emit('agent:event', req.body);
		app.vent.emit('agentEvent:' + req.body.eventName, req.body);
		deployLifecycleClient.send(req.body.eventName, req.body, req.body.correlationId);
		res.json("ok");
	});

	app.post("/agent/log", function(req, res) {
		clientSockets.sockets.volatile.emit('agent:log', req.body);
		res.json("ok");
	});

	app.post("/agent/action", app.ensureLoggedIn, function(req, res) {
		agentApiClient.sendCommand(req.body.agentName, '/action', req.body, req.user);
		res.json('ok');
	});

	// query params: agentName, url
	app.get("/agent/query", app.ensureLoggedIn, function(req, res) {
		agentApiClient.get(req.query.agentName, req.query.url, function(data) {
			res.json(data);
		});
	});
};