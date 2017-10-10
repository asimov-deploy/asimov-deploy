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
	this.agentGroups = [];
	this.unitGroups = [];
	this.unitTypes = [];
	this.unitTags = [];
	this.unitStatuses = [];
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

Config.prototype.registerAgent = function (agent) {
	this.agents.push(agent);

	agent.groups.forEach(function(g) {
		this.addAgentGroup(g);
	}, this);
};

Config.prototype.getAgent = function(name) {
	return _.find(this.agents, function(agent) { return agent.name === name; });
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

Config.prototype.addAgentGroup = function (agentGroup) {
	var existing = _.find(this.agentGroups, function (g) {
		return g === agentGroup;
	});

	if (!existing) {
		this.agentGroups.push(agentGroup);
	}
};

Config.prototype.getAgentGroups = function () {
	return _.sortBy(this.agentGroups, function (value) { return value; });
};

Config.prototype.addUnitGroups = function (unitGroups) {
	unitGroups = unitGroups || [];

	unitGroups.forEach(function (unitGroup) {
		var existing = _.find(this.unitGroups, function (g) {
			return g === unitGroup;
		});

		if (!existing) {
			this.unitGroups.push(unitGroup);
		}
	}, this);
};

Config.prototype.getUnitGroups = function () {
	return _.sortBy(this.unitGroups, function (value) { return value; });
};

Config.prototype.addUnitTypes = function (unitTypes) {
	unitTypes = unitTypes || [];

	unitTypes.forEach(function (unitType) {
		var existing = _.find(this.unitTypes, function (u) {
			return u === unitType;
		});

		if (!existing) {
			this.unitTypes.push(unitType);
		}
	}, this);
};

Config.prototype.getUnitTypes = function () {
	return _.sortBy(this.unitTypes, function (value) { return value; });
};

Config.prototype.addUnitTags = function (tags) {
	tags = tags || [];

	tags.forEach(function (tag) {
		var existing = _.find(this.unitTags, function (t) {
			return t === tag;
		});

		if (!existing) {
			this.unitTags.push(tag);
		}
	}, this);
};

Config.prototype.getUnitTags = function () {
	return _.sortBy(this.unitTags, function (value) { return value; });
};

Config.prototype.addUnitStatuses = function (unitStatuses) {
	unitStatuses = unitStatuses || [];

	unitStatuses.forEach(function (unitStatus) {
		var existing = _.find(this.unitStatuses, function (s) {
			return s === unitStatus;
		});

		if (!existing) {
			this.unitStatuses.push(unitStatus);
		}
	}, this);
};

Config.prototype.getUnitStatuses = function () {
	return _.sortBy(this.unitStatuses, function (value) { return value; });
};

module.exports = {
	Config: Config
};