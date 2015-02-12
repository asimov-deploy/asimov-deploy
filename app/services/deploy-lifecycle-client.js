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

var DeployLifecycleClient = function(config, restify) {

	var lifecycleSession = require('./deploy-lifecycle-session').create();

	restify = restify || require("restify");

	var actionUrlMappings = [];
	actionUrlMappings.startDeployLifecycleCommand = '/deploy/start';
	actionUrlMappings.completeDeployLifecycleCommand = '/deploy/finished';
	actionUrlMappings.deployCompleted = '/deploy/unit_completed';

	this.send = function(eventName, eventBody, deployId, callback) {

		var urlAction = actionUrlMappings[eventName];

		if (!config.logServerUrl || !urlAction) {
			console.log('No config.logServerUrl or missing urlAction for ' + eventName);
			return;
		}

		var deployData = lifecycleSession.getDeploySession(deployId);
		if (!deployData) {
			console.log('No deployId or deployData set for this deploy life cycle!');
			return;
		}

		eventBody.correlationId = deployData.correlationId;
		eventBody.eventName = eventName;
		eventBody.startedBy = deployData.user;
		eventBody.timestamp = new Date().toISOString();

		var client = restify.createJsonClient({
			url: config.logServerUrl,
			connectTimeout: 200
		});

		client.post(urlAction, eventBody, function(err) {
			if (err) {
				console.log('Agent command failed: ' + err);
				return;
			} else {
				console.log('pingback received');
			}

			if (callback) {
				callback();
			}
		});
	};
};

module.exports = {
	create: function(config, restify) {
		return new DeployLifecycleClient(config, restify);
	}
};