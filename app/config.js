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


var agents = [];
var _ = require("underscore");
var nconf = require('nconf');
var packageInfo = require('../package.json');
var path = require('path');
var appPath = path.dirname(process.mainModule.filename);

nconf.file({ file: path.join(appPath, 'config.json') });

nconf.defaults({
	name: "Deploy UI",
	enableDemo: false,
	port: process.env.PORT || 3333,
	authentication: [],
	sessionSecret: 'asdasdad3242352jji3o2hkjo1n2b3'
});

var config = {
	agents: [],
	version: packageInfo.version,
	enableDemo: nconf.get('enableDemo'),
	users: nconf.get('users'),
	sessionSecret: nconf.get('sessionSecret'),
	currentInstance: 0,
	authLocal: nconf.get('auth-local'),
	authGoogle: nconf.get('auth-google')
};

config.getAgent = function(param) {
	if (param.name) {
		return _.find(agents, function(agent) { return agent.name === param.name; });
	}
	if (param.loadBalancerId) {
		return _.find(agents, function(agent) { return agent.loadBalancerId === param.loadBalancerId; });
	}
};

config.loadBalancerStatusChanged = function(id, enabled) {
	var agent = config.getAgent({loadBalancerId: id});
	if (agent) {
		agent.loadBalancerEnabled = enabled;
	}
};

config.nextInstance = function() {
	config.currentInstance += 1;

	var instances = nconf.get('instances');
	if (instances && config.currentInstance >= instances.length) {
		console.log("Error: port not available!");
		return false;
	}

	var instance = instances[config.currentInstance];

	config.port = instance.port;
	config.name = instance.name;

	return true;
};

if (nconf.get('instances')) {
	var instances = nconf.get('instances');
	var instance = instances[0];
	config.port = instance.port;
	config.name = instance.name;
	config.instances = instances;
}
else {
	config.port = nconf.get('port');
	config.name = nconf.get('name');
	config.instances = [ { name: config.name, port: config.port} ];
}

module.exports = config;