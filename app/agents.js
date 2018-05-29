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
	var lifecycleSession = require('./services/deploy-lifecycle-session').create();

	app.get("/agents/list", app.ensureLoggedIn, function(req, res) {
		var agentsResp = [];

		config.agents.forEach(function(agent) {
			agentsResp.push({
				name: agent.name,
				agentGroups: agent.groups,
				dead: agent.dead,
				version: agent.version,
				configVersion: agent.configVersion,
				loadBalancerState: agent.loadBalancerState
			});
		});

		agentsResp = _.sortBy(agentsResp, 'name');
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

	app.post("/agent/heartbeat", function(req,res) {
		var existing = true;
		var agent = config.getAgent(req.body.name);

		if (!agent) {
			existing = false;
			agent = {
                name: req.body.name,
				groups:  req.body.groups || [ req.body.group ],
				supportsFiltering: req.body.group ? false : true,
				isLegacyNodeAgent: req.body.version === '1.0.0' && req.body.configVersion === '0.0.1' ? true : false
            };

			config.registerAgent(agent);
		}

		agent.url = req.body.url;
		agent.lastHeartBeat = new Date();
		agent.apiKey = req.body.apiKey;
		agent.dead = false;
		agent.version = req.body.version;
		agent.configVersion = req.body.configVersion;

		handleNewLoadBalancerState(agent, req.body.loadBalancerState);

		if (!existing && agent.supportsFiltering) {
			agentApiClient.getAgentUnitGroups(agent.name, function (unitGroups) {
				config.addUnitGroups(unitGroups);

				agentApiClient.getAgentUnitTypes(agent.name, function (unitTypes) {
					config.addUnitTypes(unitTypes);

					agentApiClient.getAgentUnitTags(agent.name, function (unitTags) {
						config.addUnitTags(unitTags);

						agentApiClient.getAgentUnitStatuses(agent.name, function (unitStatuses) {
							config.addUnitStatuses(unitStatuses);

							res.json('ok');
						});
					});
				});
			});
		}
		else {
			res.json('ok');
		}
	});

	app.post("/agent/event", function(req, res) {
		var body = req.body;
		var correlationId = body.correlationId;
		if (req.body.eventName === 'deployCompleted') {
			var session = lifecycleSession.getDeploySession(correlationId);
			var logObj = {
				unitName: body.unitName,
				version: body.version,
				branch: body.branch,
				correlationId: correlationId,
				eventName: body.eventName,
				agentName:  body.agentName,
				user: session.user,
				title: session.data.title,
				description: session.data.body
			}
			console.log(JSON.stringify(logObj));
		}
		clientSockets.sockets.volatile.emit('agent:event', body);
		app.vent.emit('agentEvent:' + body.eventName, body);
		deployLifecycleClient.send(body.eventName, body, correlationId);
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