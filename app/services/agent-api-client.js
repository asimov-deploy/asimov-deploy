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

	restify = restify || require("restify-clients");

	this.get = function(agentName, url, dataCallback) {
		var agent =  config.getAgent(agentName);
		var client = restify.createJsonClient({ url: agent.url, connectTimeout: 200 });
		client.get(url, function(err, req, _, data) {
			if (err) {
				agent.dead = true;
				console.log("Error in trying to query agent",err);
			}
			dataCallback(data);
		});

	};

	var _getUnitListUrl = function (filters, skipStatusRefresh) {
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

		if (skipStatusRefresh === true) {
			queryStrings.push('skipStatusRefresh=true');
		}

		if (queryStrings.length > 0) {
			url += '?';
		}

		return url + queryStrings.join('&');
	};

	function filterAgentGroups(agents, filterAgentGroups) {
		if (filterAgentGroups) {
			return _.filter(agents, function (agent) {
				return _.find(agent.groups, function (g) {
					return filterAgentGroups.indexOf(g) !== -1;
				});
			});
		}
		return agents;
	}

	function supportsFiltering(agent) {
		return agent.supportsFiltering;
	}

	function filtersExist(filters) {
		return filters.unitGroups || filters.unitTypes || filters.tags || filters.units || filters.unitStatus;
	}

	function filterOnFilterSupport(filters, agents) {
		var result = agents;
		if (filtersExist(filters)) {
			result = _.filter(agents, supportsFiltering);
		}		
		return result;
	}

	this.getUnits = function(filters, skipStatusRefresh, dataCallback) {
		filters = filters || {};
		var result = [];
		var agents = filterAgentGroups(config.agents, filters.agentGroups);
		agents = filterOnFilterSupport(filters, agents);

		var url = _getUnitListUrl(filters, skipStatusRefresh);

		async.forEach(agents, function(agent, done) {
			if (agent.dead) {
				done();
				return;
			}

			if (agent.isLegacyNodeAgent) {
				this.get(agent.name, '/units/list', function(units) {
					result.push({agent: agent, units: units});
					done();
				});
			}
			else {
				this.get(agent.name, url, function(units) {
					result.push({agent: agent, units: units});
					done();
				});
			}

		}.bind(this), function() {
			dataCallback(result);
		});
	};

	this.getAgentGroups = function (agentName, dataCallback) {
		this.get(agentName, '/agent-groups', dataCallback);
	};

	this.getAgentUnitGroups = function (agentName, dataCallback) {
		this.get(agentName, '/unit-groups', dataCallback);
	};

	this.getAgentUnitTypes = function (agentName, dataCallback) {
		this.get(agentName, '/unit-types', dataCallback);
	};

	this.getAgentUnitTags = function (agentName, dataCallback) {
		this.get(agentName, '/unit-tags', dataCallback);
	};

	this.getAgentUnitStatuses = function (agentName, dataCallback) {
		this.get(agentName, '/unit-statuses', dataCallback);
	};

	this.getDeployLog = function(agentName, unitName, position, dataCallback){
		var agent =  config.getAgent(agentName);
		if(agent == null ){
			console.error("Attempt to get log from unknown agent",agentName);
			dataCallback(null);
			return;
		}
		var client = restify.createStringClient({ url: agent.url, connectTimeout: 200 });
		var url = '/deploylog/file/' + unitName + '/' + position;
		client.get(url, function(err, req, _, data) {
			if (err) {
				console.log("Error in trying to query agent",err);
			}
			dataCallback(data);
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
