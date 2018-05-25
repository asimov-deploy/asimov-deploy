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

var _ = require('underscore');
var packageInfo = require('../package.json');
var crypto = require('crypto');

module.exports = function(app, config) {

	var featureToggles = require('./feature-toggle').create(config);

	var setupUserFromIap = function(req, viewModel) {
		viewModel.initData.iap = {
			headers: req.headers,
			user: req.user
		};

		if (req.user || !viewModel.initData.authUsingGoogleIap) { return; }

		var iapUser = req.headers['X-Goog-Authenticated-User-Email'];
		if (iapUser) {
			iapUser = iapUser.replace('accounts.google.com:', '');
			var user = {};
			user.name = iapUser;
			user.email = iapUser;

			var md5sum = crypto.createHash('md5');
			user.emailHash = md5sum.update(user.email).digest('hex');

			viewModel.initData.user = user;
		}
	};

	app.get('/', function(req, res) {

		var agents = _.where(config.agents, { dead: false });
		var groups = _.uniq(_.pluck(agents, ["group"])).sort();

		agents = _.pluck(agents, ["name"]);

		var viewModel = {
			hostName: req.headers.host.replace(/:\d+/, ''),
			version: packageInfo.version,
			port: config.port,
			initData: {
				groups: groups,
				agents: agents,
				authUsingGoogleIap: config['auth-google-iap'] === true,
				authUsingLocal: config['auth-local'] !== undefined,
				authUsingGoogle: config['auth-google'] !== undefined,
				flashError: req.flash('error'),
				featureToggles: featureToggles.getActiveFeatures()
			}
		};

		if (req.user) {
			var user = {};
			user.name = req.user.name;
			user.email = req.user.email;

			if (user.email) {
				var md5sum = crypto.createHash('md5');
				user.emailHash = md5sum.update(user.email).digest('hex');
			}

			viewModel.initData.user = user;
		}

		setupUserFromIap(req, viewModel);

		if (featureToggles.getActiveFeature('autopilot') && config.autopilot && config.autopilot.settings) {
			viewModel.initData.autopilot = config.autopilot.settings;
		}

		res.render('index', viewModel);
	});

};