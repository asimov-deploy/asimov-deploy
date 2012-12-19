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
var machine_config = require("./machine_config");

var getAgent = function(param) {
	if (param.name) {
		return _.find(agents, function(agent) { return agent.name == param.name; });
	}
	if (param.loadBalancerId) {
		return _.find(agents, function(agent) { return agent.loadBalancerId == param.loadBalancerId; });
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
	if (current_instance >= machine_config.instances.length)
		return false;

	var instance = machine_config.instances[current_instance];

	module.exports.port = instance.port;
	module.exports.name = instance.name;

	return true;
};

module.exports = {
	name: machine_config.instances[current_instance].name,
	port: machine_config.instances[current_instance].port,
	agents: agents,
	version: "{version}",
	username: "deploy",
	password: "secret",

	getAgent: getAgent,
	loadBalancerStatusChanged: loadBalancerStatusChanged,
	nextInstance: nextInstance
};

