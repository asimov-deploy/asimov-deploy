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
var _ = require('underscore');

var AgentApiClient = function(config, restify) {

	restify = restify || require("restify");

	this.get = function(agentName, url, dataCallback) {
		var agent =  config.getAgent(agentName);
		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });
		client.get(url, function(err, req, _, data) {
			if (err) {
				agent.dead = true;
				console.log("Error in trying to query agent");
			}
			dataCallback(data);
		});

	};

	var _getUnitListUrl = function (filters) {
		var url = '/units/list';
		var queryStrings = [];

		_.forEach(Object.keys(filters), function (key) {
			var values = filters[key];

			if (values && values.length > 0) {
				queryStrings.push((key + '=') + _.map(values, function (v) {
					return encodeURIComponent(v);
				}).join('&' + key + '='));
			}
		});

		if (queryStrings.length > 0) {
			url += '?';
		}

		return url + queryStrings.join('&');
	};

	this.getUnits = function(filters, dataCallback) {
		filters = filters || {};
		var result = [];
		var agents = config.agents;
		var distinctAgents = [];

		if (filters.agentGroups) {
			agents = _.filter(agents, function (agent) {
				return filters.agentGroups.indexOf(agent.group) !== -1;
			});
		}
		else {
			_.forEach(agents, function (agent) {
				if (_.findWhere(distinctAgents, { name: agent.name }) === undefined) {
					agent.group = '';
					distinctAgents.push(agent);
				}
			});

			agents = distinctAgents;
		}

		var url = _getUnitListUrl(filters);

		async.forEach(agents, function(agent, done) {
			if (agent.dead) {
				done();
				return;
			}
			this.get(agent.name, url, function(units) {
				result.push({agent: agent, units: units});
				done();
			});

		}.bind(this), function() {
			dataCallback(result);
		});
	};

	this.test = function(agentName) {
		return config.getAgent(agentName);
	};

	this.sendCommand = function(agentName, commandUrl, parameters, user) {
		var agent = config.getAgent(agentName);

		var client = restify.createJsonClient({
			url: agent.url,
			headers: { Authorization: agent.apiKey }
		});

		if (user) {
			parameters.userId = user.id;
			parameters.userName = user.name;
		}

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
	create: function(config, restify) {
		return new AgentApiClient(config, restify);
	}
};
