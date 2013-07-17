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
	this._currentInstance = 0;
	this.agents = [];

	if (!this.instances) {
		this.instances = [ { name: this.name, port: this.port } ];
	}

	this.nextInstance();
}

Config.prototype.defaults = {
	'name':				'Deploy UI',
	'enable-demo':		false,
	'port':				process.env.PORT || 3333,
	'session-secret': 'asdasdad3242352jji3o2hkjo1n2b3',
	'auth-none':		true
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

Config.prototype.getAgent = function(param) {
	if (param.name) {
		return _.find(this.agents, function(agent) { return agent.name === param.name; });
	}
	if (param.loadBalancerId) {
		return _.find(this.agents, function(agent) { return agent.loadBalancerId === param.loadBalancerId; });
	}
};

Config.prototype.loadBalancerStatusChanged = function(id, enabled) {
	var agent = this.getAgent({loadBalancerId: id});
	if (agent) {
		agent.loadBalancerEnabled = enabled;
	}
};

Config.prototype.nextInstance = function() {
	var instance = this.instances[this._currentInstance];

	if (!instance) {
		throw new Error("Missing another instance, no more ports available");
	}

	this.port = instance.port;
	this.name = instance.name;
	this._currentInstance += 1;

	return true;
};

module.exports = {
	Config: Config
};