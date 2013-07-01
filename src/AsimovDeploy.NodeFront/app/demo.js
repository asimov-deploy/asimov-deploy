/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the 'License');
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an 'AS IS' BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/


module.exports = function(server) {

	var demodata = require('./demodata/demo-data-generator.js');
	var _ = require('underscore');

	function emitLog(agentName, message) {
		var currentTime = new Date();

		var logs = [
			{
				agentName: agentName,
				time: "" + currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds(),
				level: "info",
				message: message
			}
		];

		clientSockets.sockets.volatile.emit('agent:log', logs);
	}

	function emitAgentEvent(data) {
		clientSockets.sockets.volatile.emit('agent:event', data);
	}

	server.get('/agents/list', function(req, res) {
		res.json(demodata.agents);
	});

	server.get('/units/list', function(req, res) {
		res.json(demodata.units);
	});

	server.get("/agent/query", function(req, res) {
		if (req.query.url.indexOf('MyCoolWebApp') !== -1) {
			return res.json(demodata.versions["MyCoolWebApp.com"]);
		}
		if (req.query.url.indexOf('WebAPI') !== -1) {
			console.log("WebApi!" + req.query.url);
			return res.json(demodata.versions["MyCoolWebApp.com WebAPI"]);
		}
		if (req.query.url.indexOf('Backend') !== -1) {
			console.log("Backend!");
			return res.json(demodata.versions["Backend.QueueHandler"]);
		}
	});

	server.post("/loadbalancer/change", function(req, res) {
		res.json("ok");

		req.body.hosts.forEach(function(host) {
			console.log("Hosts!" + host.id);
			var agent = _.find(demodata.agents, function(agent) {
				return agent.loadBalancerId === host.id;
			});

			agent.loadBalancerEnabled = !agent.loadBalancerEnabled;

			emitAgentEvent({
				eventName: "loadBalancerStateChanged",
				id: host.id,
				enabled: agent.loadBalancerEnabled
			});

			//setTimeout(function() {
			//	emitLog(agent.name, agent.loadBalancerEnabled ? "Load balancer state enabled (accessible)" : "Load balancer state disabled (inaccessible)");
			//	}, 500);
		});
	});

};