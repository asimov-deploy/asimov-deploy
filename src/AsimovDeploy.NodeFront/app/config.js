
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

