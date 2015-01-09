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
	restify = restify || require("restify");

	var actionUrlMappings = [];
	actionUrlMappings.startDeployLifecycleCommand = '/deploy/start';
	actionUrlMappings.completeDeployLifecycleCommand = '/deploy/finished';
	actionUrlMappings.deployCompleted = '/deploy/unit_completed';

	this.send = function (eventName, eventBody) {

		var urlAction = actionUrlMappings[eventName];

		if (!config.logServerUrl || !urlAction) {
			return;
		}

		var client = restify.createJsonClient({ url: config.logServerUrl, connectTimeout: 200 });
		var client1 = restify.createJsonClient({ url: 'http://localhost:5656', connectTimeout: 200 });

		client1.post('/', eventBody, function(err) {
			if (err) {
				console.log('Agent command failed: ' + err);
				return;
			} else {
				console.log('pingback received');
			}
		});

		client.post(urlAction, eventBody, function(err) {
			if (err) {
				console.log('Agent command failed: ' + err);
				return;
			} else {
				console.log('pingback received');
			}
		});


	};
};

module.exports = {
	create: function(config, restify) {
		return new DeployLifecycleClient(config, restify);
	}
};
