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

var constants = require('./constants');

module.exports = function(app, config) {

	var lifecycleClient = require('./services/deploy-lifecycle-client').create(config);
	var slackClient = require('./services/slack-client').create(config);
	var lifecycleSession = require('./services/deploy-lifecycle-session').create();
	var uuid = require('uuid/v1');
	var iapUtils = require('./auth/iap-utils');

	app.post("/deploy-lifecycle/start", app.ensureLoggedIn, function(req, res) {
		var deployId = uuid();
		res.cookie(constants.deployIdCookie, deployId);

		var data = {
			title: req.body.title,
			body: req.body.description
		};

		var user = req.user;
		if (!user && config["auth-google-iap"]) {
			user = iapUtils.getUserFromRequest(req);
		}

		lifecycleSession.init(user, deployId, data);
		var command = 'startDeployLifecycleCommand';
		slackClient.send(command, data, deployId);
		lifecycleClient.send(command, data, deployId);
		res.json('ok');
	});

	app.post("/deploy-lifecycle/complete", app.ensureLoggedIn, function(req, res) {
		var deployId = req.cookies[constants.deployIdCookie];
		res.clearCookie(constants.deployIdCookie);

		var command = 'completeDeployLifecycleCommand';
		slackClient.send(command, req.body, deployId);
		lifecycleClient.send(command, req.body, deployId, function() {
			lifecycleSession.end(deployId);
		});

		res.json('ok');
	});

	app.post("/deploy-lifecycle/cancel", app.ensureLoggedIn, function(req, res) {
		var deployId = req.cookies[constants.deployIdCookie];
		res.clearCookie(constants.deployIdCookie);
		var command = 'cancelDeployLifecycleCommand';
		slackClient.send(command, req.body, deployId);
		lifecycleClient.send(command, req.body, deployId, function() {
			lifecycleSession.end(deployId);
		});

		res.json('ok');
	});

};