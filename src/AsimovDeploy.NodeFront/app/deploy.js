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
var agentApiClient = require('./services/agent-api-client').create();

module.exports = function(server, secure) {

	// { unitName: "<unitName>", versionId: "<versionId>" }
	server.post("/deploy/to-all-agents", secure, function (req, res) {

		agentApiClient.getUnitListForAllAgents(function(results) {

			var filterUnitsByUnitName = function(unit) {
				return unit.name === req.body.unitName;
			};

			results.forEach(function(item) {

				if (_.find(item.units, filterUnitsByUnitName)) {
					agentApiClient.sendCommand(item.agent.name, '/deploy/deploy', req.body);
				}

			});

			res.json('ok');
		});

	});

	// request json body
	// { agentName: "<agentName>", unitName: "<unitName>" }
	server.post("/deploy/deploy", secure, function(req, res) {
		agentApiClient.sendCommand(req.body.agentName, '/deploy/deploy', req.body);
		res.json('ok');
	});

};