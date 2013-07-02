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

		clientSockets.sockets.emit('agent:log', logs);
	}

	function emitAgentEvent(data) {
		clientSockets.sockets.emit('agent:event', data);
	}

	server.get('/agents/list', function(req, res) {
		res.json(demodata.agents);
	});

	server.get('/units/list', function(req, res) {
		res.json(demodata.units);
	});

	server.get("/agent/query", function(req, res) {
		if (req.query.url.indexOf('WebAPI') !== -1) {
			return res.json(demodata.versions["MyCoolWebApp.com WebAPI"]);
		}
		if (req.query.url.indexOf('MyCoolWebApp') !== -1) {
			return res.json(demodata.versions["MyCoolWebApp.com"]);
		}
		if (req.query.url.indexOf('Backend') !== -1) {
			return res.json(demodata.versions["Backend.QueueHandler"]);
		}
	});

	server.post("/loadbalancer/change", function(req, res) {
		res.json("ok");

		req.body.hosts.forEach(function(host) {

			var agent = _.find(demodata.agents, function(agent) {
				return agent.loadBalancerId === host.id;
			});

			agent.loadBalancerEnabled = !agent.loadBalancerEnabled;

			emitLog(agent.name, agent.loadBalancerEnabled ? "Load balancer state enabled (accessible)" : "Load balancer state disabled (inaccessible)");

			emitAgentEvent({
				eventName: "loadBalancerStateChanged",
				id: host.id,
				enabled: agent.loadBalancerEnabled
			});

		});
	});

	server.get("/loadbalancer/listHosts", function(req, res) {
		var hosts = _.map(demodata.agents, function(agent) {
			return {
				id: agent.loadBalancerId,
				name: agent.name,
				enabled: agent.loadBalancerEnabled
			};
		});

		res.json(hosts);
	});

	server.post("/deploy/deploy", function(req, res) {

		var versions = demodata.versions[req.body.unitName];
		console.log(versions);
		var version = _.find(versions, function(version) { return version.id === req.body.versionId; });

		emitAgentEvent({
			eventName: "deployStarted",
			agentName: req.body.agentName,
			unitName: req.body.unitName,
			version: version.version,
			branch: version.branch
		});

		emitLog(req.body.agentName, "Starting deploy... (just demo text, the actual deploy agent will output meaningfull deploy info)");

		setTimeout(function() {
			emitAgentEvent({
				eventName: "deployCompleted",
				agentName: req.body.agentName,
				unitName: req.body.unitName,
				version: version.version,
				branch: version.branch,
				status: "Running"
			});
		}, 3000);

		res.json('ok');
	});

	function playVerifyDemo(req) {
		emitAgentEvent({
			eventName: "verify-progress",
			agentName: req.body.agentName,
			unitName: req.body.unitName,
			started: true
		});

		var stepCount = 0;

		function emitVerifyTest() {
			stepCount++;

			emitAgentEvent({
				eventName: "verify-progress",
				agentName: req.body.agentName,
				unitName: req.body.unitName,
				test: { message: "Loading page " + stepCount + " ok!" , pass: true }
			});

			if (stepCount < 10) {
				setTimeout(emitVerifyTest, 800);
			}
			else {
				emitAgentEvent({
					eventName: "verify-progress",
					agentName: req.body.agentName,
					unitName: req.body.unitName,
					completed: true
				});
			}
		}

		emitVerifyTest();
	}

	server.post("/agent/action", function(req, res) {
		res.json('ok');

		if (req.body.actionName === "Verify") {
			playVerifyDemo(req);
		}

		if (req.body.actionName === "Stop") {
			emitAgentEvent({
				eventName: "unitStatusChanged",
				agentName: req.body.agentName,
				unitName: req.body.unitName,
				status: "Stopping"
			});

			setTimeout(function() {
				emitAgentEvent({
					eventName: "unitStatusChanged",
					agentName: req.body.agentName,
					unitName: req.body.unitName,
					status: "Stopped"
				});
			}, 3000);
		}

		if (req.body.actionName === "Start") {
			emitAgentEvent({
				eventName: "unitStatusChanged",
				agentName: req.body.agentName,
				unitName: req.body.unitName,
				status: "Starting"
			});

			setTimeout(function() {
				emitAgentEvent({
					eventName: "unitStatusChanged",
					agentName: req.body.agentName,
					unitName: req.body.unitName,
					status: "Running"
				});
			}, 3000);
		}

	});

};