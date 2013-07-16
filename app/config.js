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

function Config() {

	var nconf = this.loadConfigFromFile();

	this.agents = [];
	this.enableDemo = nconf.get('enableDemo');
	this.users = nconf.get('users');
	this.sessionSecret = nconf.get('sessionSecret');
	this.authLocal = nconf.get('auth-local');
	this.authGoogle = nconf.get('auth-google');
	this.authNone = nconf.get('auth-none');

	this.port = nconf.get('port');
	this.name = nconf.get('name');

	this.instances = nconf.get('instances');

	if (this.instances) {
		this._currentInstance = 0;
		this.nextInstance();
	} else {
		this.instances = [ { name: this.name, port: this.port } ];
	}
}

Config.prototype.loadConfigFromFile = function() {

	var nconf = require('nconf');
	var path = require('path');
	var appPath = path.dirname(process.mainModule.filename);

	nconf.file({ file: path.join(appPath, 'config.json') });

	nconf.defaults({
		'name': 'Deploy UI',
		'enableDemo': false,
		'port': process.env.PORT || 3333,
		'sessionSecret': 'asdasdad3242352jji3o2hkjo1n2b3',
		'auth-none': true
	});

	return nconf;
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