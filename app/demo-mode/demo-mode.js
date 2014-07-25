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


module.exports = function(app) {

	var demodata = require('./demo-data-generator.js');
	var demoUtils = require('./demo-utils.js');

	var _ = require('underscore');

	function emitLog(agentName, message) {

		var logs = [
			{
				agentName: agentName,
				time: demoUtils.getCurrentTimeString(),
				level: "info",
				message: message
			}
		];

		clientSockets.sockets.emit('agent:log', logs);
	}

	function emitAgentEvent(data) {
		clientSockets.sockets.emit('agent:event', data);
	}

	app.get('/agents/list', app.ensureLoggedIn, function(req, res) {
		res.json(demodata.agents);
	});

	app.get('/units/list', app.ensureLoggedIn, function(req, res) {
		res.json(demodata.units);
	});

	app.get("/agent/query", app.ensureLoggedIn, function(req, res) {
		if (req.query.url.indexOf('deploylog') !== -1) {
			return res.json(demodata.deployLog);
		}

		if (req.query.url.indexOf('api.asimov-demo.com') !== -1) {
			return res.json(demodata.versions["api.asimov-demo.com"]);
		}
		if (req.query.url.indexOf('asimov-demo.com') !== -1) {
			return res.json(demodata.versions["asimov-demo.com"]);
		}
		if (req.query.url.indexOf('backend') !== -1) {
			return res.json(demodata.versions["backend.queue-handler"]);
		}
	});

	app.post("/loadbalancer/change", app.ensureLoggedIn, function(req, res) {
		res.json("ok");

		var agent = _.find(demodata.agents, function(agent) {
			return agent.name === req.body.agentName;
		});

		var enable = req.body.action === "enable";

		emitLog(agent.name, enable ? "Load balancer state enabled (accessible)" : "Load balancer state disabled (inaccessible)");

		agent.loadBalancerState.enabled = enable;
		agent.loadBalancerState.connectionCount = enable ? Math.floor((Math.random()*20)) : 0;

		emitAgentEvent({
			agentName: agent.name,
			state: agent.loadBalancerState,
			eventName: "loadBalancerStateChanged"
		});

	});

	app.get("/loadbalancer/servers", app.ensureLoggedIn, function(req, res) {
		var hosts = _.map(demodata.agents, function(agent) {
			return {
				name: agent.name,
				loadBalancerState: agent.loadBalancerState
			};
		});

		res.json(_.sortBy(hosts, 'name'));
	});

	app.post("/deploy/deploy", app.ensureLoggedIn, function(req, res) {

		var versions = demodata.versions[req.body.unitName];

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

	app.post("/agent/action", app.ensureLoggedIn, function(req, res) {
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

	setInterval(function () {

		_.each(demodata.agents, function (agent) {
			if (!agent.loadBalancerState.enabled) {
				return;
			}

			agent.loadBalancerState.connectionCount += Math.floor((Math.random()*40)) - 20;

			emitAgentEvent({
				agentName: agent.name,
				state: agent.loadBalancerState,
				eventName: "loadBalancerStateChanged"
			});

		});

	}, 5000);

};