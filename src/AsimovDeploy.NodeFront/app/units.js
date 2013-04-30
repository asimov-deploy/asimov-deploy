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

var agentApiClient = require('./services/agent-api-client').create();


module.exports = function(server) {

	server.get("/units/list", function(req, res) {

		var agentsResp = [];

		agentApiClient.getUnitListForAllAgents(function(results) {

			results.forEach(function(item) {
				agentsResp.push({
					name: item.agent.name,
					loadBalancerEnabled: item.agent.loadBalancerEnabled,
					loadBalancerId: item.agent.loadBalancerId,
					units: item.units
				});
			});

			res.json(agentsResp);
		});

	});

};