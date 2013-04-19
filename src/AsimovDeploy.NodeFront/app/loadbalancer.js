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

module.exports = function(server, secure) {

	var config = require('./config.js');
	var agentCommand = require('./agent-command.js');
	var restify = require("restify");
	var _  = require("underscore");


	server.get("/loadbalancer/listHosts", function(req, res) {

		var client = restify.createJsonClient({ url: config.agents[0].url });

		client.get('/loadbalancer/listHosts', function(err, req, agentResp, hostList) {
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
		res.json('ok');

		agentCommand.send(config.agents[0].name, '/loadbalancer/change', req.body);
	});

	server.post("/loadbalancer/settings", secure, function(req, res) {
		res.json('ok');

		agentCommand.send(config.agents[0].name, '/loadbalancer/settings', req.body);

	});

};