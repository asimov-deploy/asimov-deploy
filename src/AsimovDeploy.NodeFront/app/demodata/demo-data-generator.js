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


var agents = [];
var units = [];
var versions = {};

for(var i = 1; i <= 5; i++) {
	agents.push({
		name: "SE1-WEBFRONT-0" + i,
		dead: false,
		version: "0.6.12",
		configVersion: 43,
		loadBalancerId: i
	});
}

for(var i = 1; i <= 3; i++) {
	agents.push({
		name: "SE1-APPSRV-0" + i,
		dead: false,
		version: "0.6.12",
		configVersion: 43,
		loadBalancerId: i+5
	});
}

agents.forEach(function(agent) {

	if (agent.name.indexOf('WEBFRONT') !== -1) {
		units.push({
			name: agent.name,
			loadBalancerId: agent.loadBalancerId,
			loadBalancerEnabled: true,
			units: [
				{
					name: 'MyCoolWebApp.com',
					url: 'http://' + agent.name + '.prod.mykillerapp.com',
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
					name: 'MyCoolWebApp.com WebAPI',
					url: 'http://' + agent.name + '.prod.api.mykillerapp.com',
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
			loadBalancerId: agent.loadBalancerId,
			loadBalancerEnabled: true,
			units: [
				{
					name: 'Backend.QueueHandler',
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
					name: 'Backend.MemberNotification',
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

});

versions["MyCoolWebApp.com"] = [
	{ "version": "7.1.0", "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v7.1.0-[master]-[14cbf27].prod.zip" },
	{ "version": "6.9.0", "timestamp": "2013-06-25 16:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v6.9.0-[master]-[14cbf25].prod.zip" },
	{ "version": "6.8.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v6.8.0-[master]-[14cbf25].prod.zip" },
	{ "version": "6.7.0", "timestamp": "2013-06-24 15:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v6.7.0-[master]-[14cbf25].prod.zip" },
	{ "version": "5.0.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v5.0.0-[master]-[14cbf25].prod.zip" }
];

versions["MyCoolWebApp.com WebAPI"] = [
	{ "version": "3.0.0",  "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip" },
	{ "version": "2.9.0", "timestamp": "2013-06-25 16:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v2.9.0-[master]-[14cbf25].prod.zip" },
	{ "version": "2.8.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25",	"id": "mykillerapp-v2.8.0-[master]-[14cbf25].prod.zip" },
	{ "version": "2.7.0", "timestamp": "2013-06-24 15:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v2.7.0-[master]-[14cbf25].prod.zip"	},
	{ "version": "1.5.0", "timestamp": "2013-06-24 15:26:11", "branch": "master", "commit": "14cbf25", "id": "mykillerapp-v1.5.0-[master]-[14cbf25].prod.zip" }
];

versions["Backend.QueueHandler"] = versions["Backend.MemberNotification"] = [
	{ "version": "2.1.0",  "timestamp": "2013-06-28 16:26:11", "branch": "master", "commit": "14cbf27", "id": "mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip" },
	{ "version": "2.0.0", "timestamp": "2013-06-25 16:26:11", "branch": "develop", "commit": "14cbf25", "id": "mykillerapp-v2.9.0-[master]-[14cbf25].prod.zip" },
	{ "version": "1.8.0", "timestamp": "2013-06-23 15:26:11", "branch": "master", "commit": "14cbf25",	"id": "mykillerapp-v2.8.0-[master]-[14cbf25].prod.zip" },
	{ "version": "1.7.0", "timestamp": "2013-06-20 13:26:11", "branch": "my-new-feature", "commit": "14cbf25", "id": "mykillerapp-v2.7.0-[master]-[14cbf25].prod.zip"	},
	{ "version": "1.5.0", "timestamp": "2013-06-21 12:26:11", "branch": "poc", "commit": "14cbf25", "id": "mykillerapp-v1.5.0-[master]-[14cbf25].prod.zip" }
];

module.exports = {
	agents: agents,
	units: units,
	versions: versions
};