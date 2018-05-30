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
var constants = require('./constants');

module.exports = function(app, config) {

	var agentApiClient = require('./services/agent-api-client').create(config);
	
	// { unitName: "<unitName>", versionId: "<versionId>" }
	app.post("/deploy/to-all-agents", app.ensureLoggedIn, function(req, res) {

		agentApiClient.getUnitListForAllAgents(function(results) {

			var filterUnitsByUnitName = function(unit) {
				return unit.name === req.body.unitName;
			};

			results.forEach(function(item) {

				if (_.find(item.units, filterUnitsByUnitName)) {
					agentApiClient.sendCommand(item.agent.name, '/deploy/deploy', req.body, req.user);
				}

			});

			res.json('ok');
		});

	});

	// request json body
	// { agentName: "<agentName>", unitName: "<unitName>" }
	app.post("/deploy/deploy", app.ensureLoggedIn, function(req, res) {
		req.body.correlationId = req.cookies[constants.deployIdCookie];
		agentApiClient.sendCommand(req.body.agentName, '/deploy/deploy', req.body, req.user);
		res.json('ok');
	});

};