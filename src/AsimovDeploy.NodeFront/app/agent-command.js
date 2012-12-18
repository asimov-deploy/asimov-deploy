var config = require('./config.js');
var restify = require("restify");

module.exports = {

	send: function(agentName, commandUrl, parameters) {
		var agent = config.getAgent({ name: agentName });
		
		commandUrl = commandUrl + "?apikey=" + agent.apiKey;

		var client = restify.createJsonClient({ url: agent.url });
		
		client.post(commandUrl, parameters,
			function(err, req, res, obj) {
				if (err) {
					console.log("Agent command failed: " + err);
					return;
				}

				console.log('%d -> %j', res.statusCode, res.headers);
				console.log('%j', obj);
			});
	}
	
};
