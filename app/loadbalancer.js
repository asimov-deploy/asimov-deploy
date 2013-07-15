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

var config = require('./config.js');
var agentApiClient = require('./services/agent-api-client').create();
var _  = require("underscore");


module.exports = function(server, secure) {

	server.get("/loadbalancer/listHosts", secure, function(req, res) {
		if (config.agents.length === 0) {
			return res.json([]);
		}

		agentApiClient.get(config.agents[0].name, '/loadbalancer/listHosts', function(hostList) {
			if (!hostList) {
				return res.json({});
			}

			hostList.forEach(function(host) {
				config.loadBalancerStatusChanged(host.id, host.enabled);
			});

			var filtered = _.filter(hostList, function(host) {
				return config.getAgent({loadBalancerId: host.id});
			});

			res.json(filtered);
		});

	});

	server.post("/loadbalancer/change", secure,  function(req, res) {
		agentApiClient.sendCommand(config.agents[0].name, '/loadbalancer/change', req.body);
		res.json('ok');
	});

	server.post("/loadbalancer/settings", secure, function(req, res) {
		agentApiClient.sendCommand(config.agents[0].name, '/loadbalancer/settings', req.body);
		res.json('ok');
	});

};