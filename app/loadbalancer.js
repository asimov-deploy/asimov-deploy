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

	var agentApiClient = require('./services/agent-api-client').create(config);

	app.get("/loadbalancer/servers", app.ensureLoggedIn, function(req, res) {
		var agentsResp = [];

		config.agents.forEach(function(agent) {
			if (agent.dead) {
				return;
			}

			agentsResp.push({
				name: agent.name,
				loadBalancerState: agent.loadBalancerState
			});
		});

		res.json(agentsResp);
	});

	app.post("/loadbalancer/change", app.ensureLoggedIn,  function(req, res) {
		agentApiClient.sendCommand(req.body.agentName, '/loadbalancer/change', req.body, req.user);
		res.json('ok');
	});

	app.vent.on('agentEvent:loadBalancerStateChanged', function(evt) {
		var agent = config.getAgent(evt.agentName);
		agent.loadBalancerState = evt.state;
	});

};