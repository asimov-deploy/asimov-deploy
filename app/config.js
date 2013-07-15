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

var path = require('path');
var appPath = path.dirname(process.mainModule.filename);

nconf.file({ file: path.join(appPath, 'config.json') });

nconf.defaults({
	name: "Deploy UI",
	enableDemo: false,
	port: process.env.PORT || 3333,
	authentication: false
});

var getAgent = function(param) {
	if (param.name) {
		return _.find(agents, function(agent) { return agent.name === param.name; });
	}
	if (param.loadBalancerId) {
		return _.find(agents, function(agent) { return agent.loadBalancerId === param.loadBalancerId; });
	}
};

var loadBalancerStatusChanged = function(id, enabled) {
	var agent = getAgent({loadBalancerId: id});
	if (agent) {
		agent.loadBalancerEnabled = enabled;
	}
};

var current_instance = 0;

var nextInstance = function() {
	current_instance += 1;
	var instances = nconf.get('instances');
	if (instances && current_instance >= instances.length) {
		console.log("Error: port not available!");
		return false;
	}

	var instance = instances[current_instance];

	module.exports.port = instance.port;
	module.exports.name = instance.name;

	return true;
};

var packageInfo = require('../package.json');

module.exports = {
	agents: agents,
	version: packageInfo.version,
	getAgent: getAgent,
	loadBalancerStatusChanged: loadBalancerStatusChanged,
	nextInstance: nextInstance
};

module.exports.enableDemo = nconf.get('enableDemo');
module.exports.authentication = nconf.get('authentication');
module.exports.users = nconf.get('users');

if (nconf.get('instances')) {
	var instances = nconf.get('instances');
	var instance = instances[0];
	module.exports.port = instance.port;
	module.exports.name = instance.name;
	module.exports.instances = instances;
}
else {
	module.exports.port = nconf.get('port');
	module.exports.name = nconf.get('name');
	module.exports.instances = [
		{
			name: module.exports.name,
			port: module.exports.port
		}
	];
}