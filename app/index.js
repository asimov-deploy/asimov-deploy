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

	app.get('/', function(req, res) {

		var agents = _.where(config.agents, { dead: false });
		agents = _.pluck(agents, ["name"]);

		var viewModel = {
			hostName: req.headers.host.replace(/:\d+/, ''),
			version: packageInfo.version,
			port: config.port,
			instances: config.instances,
			instanceName: config.name,
			initData: {
				agents: agents,
				authUsingLocal: config.authLocal !== undefined,
				authUsingGoogle: config.authGoogle !== undefined
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

		res.render('index', viewModel);
	});

};