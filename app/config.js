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

var _ = require("underscore");
var path = require('path');
var fs = require('fs');

function Config(configOverrides) {
	this._loadConfigFromFile(configOverrides);
	this.agents = [];
}

Config.prototype.defaults = {
	'name':				'Deploy UI',
	'enable-demo':		false,
	'port':				process.env.PORT || 3333,
	'session-secret': 'asdasdad3242352jji3o2hkjo1n2b3',
	'auth-anonymous':	true,
	'plugins': []
};

Config.prototype._applyConfig = function(cfg) {
	Object.keys(cfg).forEach(function(key) {
		this[key] = cfg[key];
	}.bind(this));
};

Config.prototype._loadConfigFromFile = function(configOverrides) {
	var appPath = path.dirname(process.mainModule.filename);
	var configPath = path.join(appPath, 'config.json');

	this._applyConfig(this.defaults);

	if (fs.existsSync(configPath)) {
		var config = require(configPath);
		this._applyConfig(config);
	}

	if (configOverrides) {
		this._applyConfig(configOverrides);
	}
};

Config.prototype.getAgent = function(name) {
	return _.find(this.agents, function(agent) { return agent.name === name; });
};

Config.prototype.getAgentByGroup = function(name, group) {
	return _.find(this.agents, function(agent) { return agent.name === name && agent.group === group; });
};

Config.prototype.getAgentList = function() {
	var agentsResp = [];

	this.agents.forEach(function(agent) {
		if (agent.dead) {
			return;
		}

		agentsResp.push({
			name: agent.name,
			loadBalancerState: agent.loadBalancerState
		});
	});
	return _.sortBy(agentsResp, 'name');
};

module.exports = {
	Config: Config
};