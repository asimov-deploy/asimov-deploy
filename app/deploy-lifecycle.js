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
	var lifecycleSession = require('./services/deploy-lifecycle-session').create();
	var uuid = require('node-uuid');

	app.post("/deploy-lifecycle/start", app.ensureLoggedIn, function(req, res) {

		var deployId = uuid.v1();
		res.cookie(config.deployIdCookie, deployId);

		var data = {
			title: req.body.title,
			body: req.body.description
		};

		lifecycleSession.init(req.user, deployId);
		lifecycleClient.send('startDeployLifecycleCommand', data, deployId);
		res.json('ok');
	});

	app.post("/deploy-lifecycle/complete", app.ensureLoggedIn, function(req, res) {

		var deployId = req.cookies[config.deployIdCookie];
		res.clearCookie(config.deployIdCookie);

		lifecycleClient.send('completeDeployLifecycleCommand', req.body, deployId, function () {
			lifecycleSession.end(deployId);
		});

		res.json('ok');
	});
};