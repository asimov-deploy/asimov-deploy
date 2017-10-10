/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the 'License');
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an 'AS IS' BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

var _ = require('underscore');
var utils = require('./demo-utils');

var registerWebfrontAgents = function (config) {
	for (var i = 1; i <= 5; i++) {
		var agent = {
			name: "SE1-WEBFRONT-0" + i,
			groups: [ 'Web servers' ],
			dead: false,
			version: "0.6.12",
			configVersion: 43,
			loadBalancerState: {
				enabled: true,
				connectionCount: Math.floor((Math.random()*580)),
				serverId: "SE1-WEBFRONT-0" + i
			}
		};

		config.registerAgent(agent);
	}
};

var registerAppServerAgents = function (config) {
	for (var i = 1; i <= 5; i++) {
		var agent = {
			name: "SE1-APPSRV-0" + i,
			groups: [ 'Application servers' ],
			dead: false,
			version: "0.6.12",
			configVersion: 43,
			loadBalancerState: {
				enabled: true,
				connectionCount: Math.floor((Math.random()*580)),
				serverId: "SE1-APPSRV-0" + i
			}
		};

		config.registerAgent(agent);
	}
};

var registerUnits = function (config) {
	var units = [];

	config.agents.forEach(function (agent) {

		if (agent.name.indexOf('WEBFRONT') !== -1) {
			units.push({
				name: agent.name,
				group: agent.groups[0],
				loadBalancerState: agent.loadBalancerState,
				units: [
					{
						name: 'asimov-demo.com',
						group: 'Webfront',
						type: 'WebSite',
						tags: [ 'host:' + agent.name, 'os:Windows' ],
						url: 'http://' + agent.name + '.prod.asimov-demo.com',
						version: '7.1.0',
						branch: 'master',
						status: 'Running',
						lastDeployed: 'Deployed 1 hour ago',
						hasDeployParameters: false,
						actions: [
							'Verify',
							'Start',
							'Stop'
						]
					},
					{
						name: 'api.asimov-demo.com',
						group: 'Webfront',
						type: 'WebSite',
						tags: [ 'host:' + agent.name, 'os:Windows' ],
						url: 'http://' + agent.name + '.prod.api.asimov-demo.com',
						version: '3.0.0',
						branch: 'master',
						status: 'Running',
						lastDeployed: 'Deployed 2 days ago',
						hasDeployParameters: false,
						actions: [
							'Verify',
							'Start',
							'Stop'
						]
					}
				]
			});
		}

		if (agent.name.indexOf('SE1-APPSRV') !== -1) {
			units.push({
				name: agent.name,
				group: agent.groups[0],
				loadBalancerId: agent.loadBalancerId,
				loadBalancerState: agent.loadBalancerState,
				units: [
					{
						name: 'backend.queue-handler',
						group: 'Backend',
						type: 'WindowsService',
						tags: [ 'host:' + agent.name, 'os:Linux' ],
						version: '2.1.0',
						branch: 'master',
						status: 'Running',
						lastDeployed: 'Deployed 10 days ago',
						hasDeployParameters: false,
						actions: [
							'Start',
							'Stop'
						]
					},
					{
						name: 'backend.member-notification',
						group: 'Backend',
						type: 'WindowsService',
						tags: [ 'host:' + agent.name, 'os:Linux' ],
						version: '2.1.0',
						branch: 'master',
						status: 'Running',
						lastDeployed: 'Deployed 2 days ago',
						hasDeployParameters: false,
						actions: [
							'Start',
							'Stop'
						]
					}
				]
			});
		}

		units.forEach(function (agentUnits) {
			config.addUnitGroups(_.pluck(agentUnits.units, 'group'));
			config.addUnitTypes(_.pluck(agentUnits.units, 'type'));
			config.addUnitTags(_.flatten(_.map(agentUnits.units, function (u) {
				return u.tags;
			})));
		});
	});

	config.addUnitStatuses([
		'DeployFailed',
		'Deploying',
		'NA',
		'NotFound',
		'Running',
		'Starting',
		'Stopped',
		'Stopping'
	]);

	return units;
};

var DemodataGenerator = function (config) {
	registerWebfrontAgents(config);
	registerAppServerAgents(config);
	var units = registerUnits(config);

	var versions = {};

	versions["asimov-demo.com"] = [
		{ "version": "7.1.0", "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v7.1.0-[master]-[14cbf27].prod.zip" },
		{ "version": "6.9.0", "timestamp": "2013-06-25 16:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v6.9.0-[master]-[14cbf25].prod.zip" },
		{ "version": "6.8.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v6.8.0-[master]-[14cbf25].prod.zip" },
		{ "version": "6.7.0", "timestamp": "2013-06-24 15:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v6.7.0-[master]-[14cbf25].prod.zip" },
		{ "version": "5.0.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v5.0.0-[master]-[14cbf25].prod.zip" }
	];

	versions["api.asimov-demo.com"] = [
		{ "version": "3.0.0",  "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip" },
		{ "version": "2.9.0", "timestamp": "2013-06-25 16:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v2.9.0-[master]-[14cbf25].prod.zip" },
		{ "version": "2.8.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25",	"id": "mykillerapp-v2.8.0-[master]-[14cbf25].prod.zip" },
		{ "version": "2.7.0", "timestamp": "2013-06-24 15:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v2.7.0-[master]-[14cbf25].prod.zip"	},
		{ "version": "1.5.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v1.5.0-[master]-[14cbf25].prod.zip" }
	];

	versions["backend.queue-handler"] = versions["backend.member-notification"] = [
		{ "version": "2.1.0",  "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip" },
		{ "version": "2.0.0", "timestamp": "2013-06-25 16:26:11", "branch": "develop", "commit": "14cbf25", "id": "mykillerapp-v2.9.0-[master]-[14cbf25].prod.zip" },
		{ "version": "1.8.0", "timestamp": "2013-06-23 15:26:11", "branch": "master", "commit": "14cbf25",	"id": "mykillerapp-v2.8.0-[master]-[14cbf25].prod.zip" },
		{ "version": "1.7.0", "timestamp": "2013-06-20 13:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v2.7.0-[master]-[14cbf25].prod.zip"	},
		{ "version": "1.5.0", "timestamp": "2013-06-21 12:26:11", "branch": "poc", "commit": "14cbf25", "id": "mykillerapp-v1.5.0-[master]-[14cbf25].prod.zip" }
	];

	var deployLog = [
		{ timestamp: "2013-06-14 16:25:11", username: "BlameMe",				version: "2.1.0", branch: "master", commit: "14cbf27", status: "Success" },
		{ timestamp: "2013-06-13 12:21:11", username: "Torkel Ödegaard",	version: "2.0.0", branch: "master", commit: "14cbf27", status: "Success" },
		{ timestamp: "2013-06-12 11:21:11", username: "Test User",			version: "1.8.0", branch: "uber-feature", commit: "14cbf27", status: "DeployFailed" },
		{ timestamp: "2013-06-10 07:25:11", username: "Test User",			version: "1.6.0", branch: "master", commit: "14cbf27", status: "Success" },
		{ timestamp: "2013-06-10 07:15:01", username: "Demo User",			version: "1.1.0", branch: "develop", commit: "14cbf27", status: "Success" }
	];

	var autopilot = {
		preferredBranch: 'master',
		deployableUnitSets: [
			{
				"id": "api_asimov_demo_com",
				"name": "Api",
				"description": "Automatic deploy of api.asimov-demo.com",
				"units": [ "api.asimov-demo.com" ],
				"defaultDeployToMaximumAgentsSimultaneously": 2,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "DisableLoadBalancerForAgents", "Deploy", "Verify", "Prompt", "EnableLoadBalancerForAgents" ],
				"steps": [ "DisableLoadBalancerForAgents", "Deploy", "Verify", "EnableLoadBalancerForAgents" ]
			},
			{
				"id": "asimov_demo_com",
				"name": "Site",
				"description": "Automatic deploy of asimov-demo.com",
				"units": [ "asimov-demo.com" ],
				"defaultDeployToMaximumAgentsSimultaneously": 2,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "DisableLoadBalancerForAgents", "Deploy", "Prompt", "EnableLoadBalancerForAgents" ],
				"steps": [ "DisableLoadBalancerForAgents", "Deploy", "EnableLoadBalancerForAgents" ]
			},
			{
				"id": "api_asimov_demo_com_and_asimov_demo_com",
				"name": "Api + Site",
				"description": "Automatic deploy of api.asimov-demo.com and asimov-demo.com",
				"units": [ "asimov-demo.com", "api.asimov-demo.com" ],
				"defaultDeployToMaximumAgentsSimultaneously": 2,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "DisableLoadBalancerForAgents", "Deploy", "Prompt", "EnableLoadBalancerForAgents" ],
				"steps": [ "DisableLoadBalancerForAgents", "Deploy", "EnableLoadBalancerForAgents" ]
			},
			{
				"id": "backend_member_notification",
				"name": "Member Notification",
				"description": "Automatic deploy of backend.member-notification",
				"units": [ "backend.member-notification" ],
				"defaultDeployToMaximumAgentsSimultaneously": 1,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "Deploy", "Prompt" ],
				"steps": [ "Deploy" ]
			},
			{
				"id": "backend_queue_handler",
				"name": "Queue Handler",
				"description": "Automatic deploy of backend.queue-handler",
				"units": [ "backend.queue-handler" ],
				"defaultDeployToMaximumAgentsSimultaneously": 1,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "Deploy", "Prompt" ],
				"steps": [ "Deploy" ]
			},
			{
				"id": "backend_member_notification_and_backend_queue_handler",
				"name": "Member Notification + Queue Handler",
				"description": "Automatic deploy of backend.member-notification and backend.queue-handler",
				"units": [ "backend.member-notification", "backend.queue-handler" ],
				"defaultDeployToMaximumAgentsSimultaneously": 1,
				"defaultVerificationIterationCount": 1,
				"verificationSteps": [ "Deploy", "Prompt" ],
				"steps": [ "Deploy" ]
			}
		]
	};

	var _getUnits = function (filters) {
		/*jshint maxcomplexity:7 */

		var unitsByAgentGroup = utils.getUnitsByAgentGroup(units);
		var unitsByUnitGroup = utils.getUnitsByUnitGroup(units);
		var unitsByUnitType = utils.getUnitsByUnitType(units);
		var unitsByUnitStatus = utils.getUnitsByUnitStatus(units);
		var unitsByTags = utils.getUnitsByTags(units);

		var unitList = _
			.chain(units)
			.map(function (agentUnits) {
				return _.map(agentUnits.units, function (u) {
					return {
						agentName: agentUnits.name,
						unitName: u.name
					};
				});
			})
			.flatten()
			.sortBy('unitName')
			.value();

		var filteredUnits = unitList;

		var filteredByAgentGroups = [];

		if (filters.agentGroups) {
			_.each(filters.agentGroups, function (g) {
				if (unitsByAgentGroup[g]) {
					filteredByAgentGroups.push(unitsByAgentGroup[g]);
				}
			});

			filteredByAgentGroups = _.flatten(filteredByAgentGroups);

			filteredUnits = utils.intersectionObjects(filteredUnits, filteredByAgentGroups, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var filteredByUnitGroups = [];

		if (filters.unitGroups) {
			_.each(filters.unitGroups, function (g) {
				if (unitsByUnitGroup[g]) {
					filteredByUnitGroups.push(unitsByUnitGroup[g]);
				}
			});

			filteredByUnitGroups = _.flatten(filteredByUnitGroups);

			filteredUnits = utils.intersectionObjects(filteredUnits, filteredByUnitGroups, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var filteredByUnitTypes = [];

		if (filters.unitTypes) {
			_.each(filters.unitTypes, function (g) {
				if (unitsByUnitType[g]) {
					filteredByUnitTypes.push(unitsByUnitType[g]);
				}
			});

			filteredByUnitTypes = _.flatten(filteredByUnitTypes);

			filteredUnits = utils.intersectionObjects(filteredUnits, filteredByUnitTypes, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var filteredByTags = [];

		if (filters.tags) {
			_.each(filters.tags, function (g) {
				if (unitsByTags[g]) {
					filteredByTags.push(unitsByTags[g]);
				}
			});

			filteredByTags = _.flatten(filteredByTags);

			filteredUnits = utils.intersectionObjects(filteredUnits, filteredByTags, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var filteredByUnitStatus = [];

		if (filters.unitStatus) {
			_.each(filters.unitStatus, function (g) {
				if (unitsByUnitStatus[g]) {
					filteredByUnitStatus.push(unitsByUnitStatus[g]);
				}
			});

			filteredByUnitStatus = _.flatten(filteredByUnitStatus);

			filteredUnits = utils.intersectionObjects(filteredByUnitStatus, filteredUnits, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var filteredByUnitNames = [];

		if (filters.units) {
			_.each(filters.units, function (unitName) {
				if (!unitName.startsWith('^'))
                {
                    unitName = '^' + unitName;
                }

                if (!unitName.endsWith('$'))
                {
                    unitName = unitName + '$';
                }

				_
				.chain(unitList)
				.filter(function (u) {
					var regex = new RegExp(unitName, 'gi');
					return regex.test(u.unitName);
				})
				.each(function (unit) {
					var existing = _.find(filteredByUnitNames, function (f) {
						return f.unitName === unit.unitName &&
							   f.agentName === unit.agentName;
					}) !== undefined;

					if (!existing) {
						filteredByUnitNames.push(unit);
					}
				})
				.value();
			});

			filteredByUnitNames = _.flatten(filteredByUnitNames);

			filteredUnits = utils.intersectionObjects(filteredUnits, filteredByUnitNames, function (item1, item2) {
				return item1.unitName === item2.unitName &&
					   item1.agentName === item2.agentName;
			});
		}

		var result = [];

		_.each(units, function (agentUnits) {
			var existingAgent = _.find(filteredUnits, function (filteredUnit) {
				return filteredUnit.agentName === agentUnits.name;
			});

			if (existingAgent !== undefined) {
				result.push({
					name: agentUnits.name,
					group: agentUnits.group,
					loadBalancerState: agentUnits.loadBalancerState,
					units: _.filter(agentUnits.units, function (u) {
						var existingUnit = _.find(filteredUnits, function (filteredUnit) {
							return filteredUnit.agentName === agentUnits.name &&
								   filteredUnit.unitName === u.name;
						});

						return existingUnit !== undefined;
					})
				});
			}
		});

		return result;
	};

	var _updateUnitStatus = function (agentName, unitName, status) {
		// jshint maxdepth:4

		for (var n = 0; n < units.length; n++) {
			var agent = units[n];

			if (agent.name === agentName) {
				for (var i = 0; i < agent.units.length; i++) {
					var unit = agent.units[i];

					if (unit.name === unitName) {
						unit.status = status;
					}
				}
			}
		}
	};

	return {
		units: units,
		versions: versions,
		deployLog: deployLog,
		autopilot: autopilot,
		getUnits: _getUnits,
		updateUnitStatus: _updateUnitStatus
	};
};

module.exports = DemodataGenerator;