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

module.exports = function(app, config) {

	var lifecycleClient = require('./services/deploy-lifecycle-client').create(config);
	var slackClient = require('./services/slack-client').create(config);
	var lifecycleSession = require('./services/deploy-lifecycle-session').create();
	var featureToggle = require('./feature-toggle').create(config);
	var uuid = require('node-uuid');

	var annotationsConfig = featureToggle.getActiveFeature('deployAnnotations');

	app.post("/deploy-lifecycle/start", app.ensureLoggedIn, function(req, res) {
		var deployId = uuid.v1();
		res.cookie(annotationsConfig.deployIdCookie, deployId);

		var data = {
			title: req.body.title,
			body: req.body.description
		};

		lifecycleSession.init(req.user, deployId, data);
		var command = 'startDeployLifecycleCommand';
		slackClient.send(command, data, deployId);
		lifecycleClient.send(command, data, deployId);
		res.json('ok');
	});

	app.post("/deploy-lifecycle/complete", app.ensureLoggedIn, function(req, res) {
		var deployId = req.cookies[annotationsConfig.deployIdCookie];
		res.clearCookie(annotationsConfig.deployIdCookie);

		var command = 'completeDeployLifecycleCommand';
		slackClient.send(command, req.body, deployId);
		lifecycleClient.send(command, req.body, deployId, function() {
			lifecycleSession.end(deployId);
		});

		res.json('ok');
	});

	app.post("/deploy-lifecycle/cancel", app.ensureLoggedIn, function(req, res) {
		var deployId = req.cookies[annotationsConfig.deployIdCookie];
		res.clearCookie(annotationsConfig.deployIdCookie);
		var command = 'cancelDeployLifecycleCommand';
		slackClient.send(command, req.body, deployId);
		lifecycleClient.send(command, req.body, deployId, function() {
			lifecycleSession.end(deployId);
		});

		res.json('ok');
	});
};