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
		loadBalancerState: {
			enabled: true,
			connectionCount: Math.floor((Math.random()*580)),
			serverId: "SE1-WEBFRONT-0" + i
		}
	});
}

for(var i = 1; i <= 3; i++) {
	agents.push({
		name: "SE1-APPSRV-0" + i,
		dead: false,
		version: "0.6.12",
		configVersion: 43,
		loadBalancerState: {
			enabled: true,
			connectionCount: Math.floor((Math.random()*580)),
			serverId: "SE1-WEBFRONT-0" + i
		}
	});
}

agents.forEach(function(agent) {

	if (agent.name.indexOf('WEBFRONT') !== -1) {
		units.push({
			name: agent.name,
			loadBalancerState: agent.loadBalancerState,
			units: [
				{
					name: 'asimov-demo.com',
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
			loadBalancerId: agent.loadBalancerId,
			loadBalancerState: agent.loadBalancerState,
			units: [
				{
					name: 'backend.queue-handler',
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

module.exports = {
	agents: agents,
	units: units,
	versions: versions,
	deployLog: deployLog,
	autopilot: autopilot
};