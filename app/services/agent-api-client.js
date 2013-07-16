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

var async = require('async');
var restify = require("restify");

var AgentApiClient = function(config) {

	this.get = function(agentName, url, dataCallback) {

		var agent =  config.getAgent({ name: agentName });

		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });

		client.get(url, function(err, req, _, data) {
			if (err) {
				agent.dead = true;
				console.log("Error in trying to query agent");
			}
			dataCallback(data);
		});

	};

	this.getUnitListForAllAgents = function(dataCallback) {
		var result = [];

		async.forEach(config.agents, function(agent, done) {
			if (agent.dead) {
				done();
				return;
			}

			this.get(agent.name, '/units/list', function(units) {
				result.push({agent: agent, units: units});
				done();
			});

		}.bind(this), function() {
			dataCallback(result);
		});
	};

	this.sendCommand = function(agentName, commandUrl, parameters) {
		var agent = config.getAgent({ name: agentName });
		var client = restify.createJsonClient({ url: agent.url });

		commandUrl = commandUrl + "?apikey=" + agent.apiKey;

		client.post(commandUrl, parameters, function(err, req, res, obj) {
			if (err) {
				console.log("Agent command failed: " + err);
				return;
			}

			console.log('%d -> %j', res.statusCode, res.headers);
			console.log('%j', obj);
		});
	};
};



module.exports = {
	create: function(config) {
		return new AgentApiClient(config);
	}
};
