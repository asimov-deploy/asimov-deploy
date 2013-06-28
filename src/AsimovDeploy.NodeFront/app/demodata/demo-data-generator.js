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

for(var i = 1; i <= 8; i++) {
	agents.push({
		name: "SE1-WEBFRONT-0" + i,
		dead: false,
		version: "0.6.12",
		configVersion: 43,
		loadBalancerId: i
	});
}

for(var i = 1; i <= 4; i++) {
	agents.push({
		name: "SE1-APPSRV-0" + i,
		dead: false,
		version: "0.6.12",
		configVersion: 43,
		loadBalancerId: i+8
	});
}

agents.forEach(function(agent) {

	if (agent.name.indexOf('WEBFRONT') != -1) {
		var agentUnits = {
			name: agent.name,
			loadBalancerId: agent.loadBalancerId,
			loadBalancerEnabled: true,
			units: [
				{
					name: 'MyKillerApp.com',
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
					name: 'MyOtherKillerApp.com',
					url: 'http://' + agent.name + '.prod.myotherkillerapp.com',
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
		};
	}

	if (agent.name.indexOf('WEBFRONT') != -1) {
		var agentUnits = {
			name: agent.name,
			loadBalancerId: agent.loadBalancerId,
			loadBalancerEnabled: true,
			units: [
				{
					name: 'MyKillerApp.com',
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
					name: 'MyOtherKillerApp.com',
					url: 'http://' + agent.name + '.prod.myotherkillerapp.com',
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
		};

		units.push(agentUnits);
	}

});

module.exports = {
	agents: agents,
	units: units
};