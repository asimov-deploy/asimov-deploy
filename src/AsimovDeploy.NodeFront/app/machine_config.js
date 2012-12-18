var os = require("os");
var hostname = os.hostname().toLowerCase();

var machine_configs = {
	defaults: {
		instances: [
			{
				name: hostname,
				port: 3333
			}
		]
	}
};


var machine_config = machine_configs[hostname];
if (!machine_config)
{
	machine_config = machine_configs.defaults;
}

module.exports = machine_config;