
var https = require('https');

var _colors = {
	startDeployLifecycleCommand: 'warning',
	completeDeployLifecycleCommand: 'good',
	cancelDeployLifecycleCommand: 'danger'
};

var _eventNames = {
	startDeployLifecycleCommand: 'releasing',
	completeDeployLifecycleCommand: 'finished',
	cancelDeployLifecycleCommand: 'cancelled'
};

function postToSlack(urlToken, body) {
	var postData = JSON.stringify(body);
	var options = {
		hostname: 'hooks.slack.com',
		port: 443,
		path: '/services/' + urlToken,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': postData.length
		}
	};

	var req = https.request(options, function(res) {
		console.log('Slack statusCode:', res.statusCode);
		res.on('data', function(d) {
			process.stdout.write(d);
		});
	});

	req.on('error', function(e) {
		console.error(e);
	});

	req.write(postData);
	req.end();
}

var SlackClient = function (config) {
	var lifecycleSession = require('./deploy-lifecycle-session').create();
	var featureToggle = require('./../feature-toggle').create(config);
	var slackConfig = featureToggle.getActiveFeature('Slack');

	this.send = function (eventName, eventBody, deployId) {
		if (slackConfig.enabled !== true) {
			return;
		}

		var deployData = lifecycleSession.getDeploySession(deployId);
		if (!deployData) {
			return;
		}

		var slackEventName = _eventNames[eventName];
		var username = deployData.user;
		var title = deployData.data.title;
		var color = _colors[eventName];
		var text = deployData.data.body;

		var body = {
			text: username + ' ' + slackEventName + ':',
			attachments: [
				{
					title: title,
					text: text,
					color: color
				}
			]
		};

		postToSlack(slackConfig.urlToken, body);
	};
};

module.exports = {
	create: function (config) {
		return new SlackClient(config);
	}
};
