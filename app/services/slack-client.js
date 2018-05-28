
var https = require('https');
var _ = require('underscore');

var _colors = {
	startDeployLifecycleCommand: 'warning',
	completeDeployLifecycleCommand: 'good',
	cancelDeployLifecycleCommand: 'danger'
};

var _slackDisplayEventNames = {
	startDeployLifecycleCommand: 'releasing',
	completeDeployLifecycleCommand: 'finished',
	cancelDeployLifecycleCommand: 'cancelled'
};

var _lifeCycleNames = {
	startDeployLifecycleCommand: 'started',
	completeDeployLifecycleCommand: 'completed',
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
	var lifecycleConfig = featureToggle.getActiveFeature('lifecycleControls') || {};
	var slackConfig = lifecycleConfig.Slack || {};

	this.send = function (eventName, eventBody, deployId) {
		if (lifecycleConfig.enabled !== true) {
			return;
		}

		var deployData = lifecycleSession.getDeploySession(deployId);
		if (!deployData) {
			return;
		}

		var lifeCycleEventName = _lifeCycleNames[eventName];
		var slackEventName = _slackDisplayEventNames[eventName];
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

		for (var i = slackConfig.channels.length - 1; i >= 0; i--) {
			var channel = slackConfig.channels[i];
			if (_.contains(channel.events, lifeCycleEventName)){
				postToSlack(channel.urlToken, body);
			}
		}
	};
};

module.exports = {
	create: function (config) {
		return new SlackClient(config);
	}
};
