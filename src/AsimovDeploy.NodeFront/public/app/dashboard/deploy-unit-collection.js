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

define([
	"jquery",
	"underscore",
	"backbone",
	"./deploy-unit"
],
function($, _, Backbone, DeployUnit) {

	return Backbone.Collection.extend({

		getDeployUnit: function(unitName, agentName) {
			return this.where({
				unitName: unitName,
				agentName: agentName
			})[0];
		},

		fetch: function() {
			var units = [];
			var self = this;
			var defered = $.Deferred();

			$.getJSON('units/list', function(agents) {
				agents.forEach(function(agent) {
					agent.units.forEach(function(unit) {
						unit = units[unit.name] ? units[unit.name] : {
							name: unit.name,
							actions: unit.actions,
							instances: []
						};

						unit.instances.push(new DeployUnit({
							agentName: agent.name,
							url: unit.url,
							status: unit.status,
							deployStatus: unit.deployStatus,
							loadBalancerId: agent.loadBalancerId,
							loadBalancerEnabled: agent.loadBalancerEnabled,
							info: unit.info,
							version: unit.version,
							branch: unit.branch,
							actions: unit.actions,
							hasDeployParameters: unit.hasDeployParameters
						}));

						units[unit.name] = unit;
					});
				});

				/*units.sort(function(a, b) {
					var a_unitName = a.get('unitName');
					var b_unitName = b.get('unitName');

					if (a.get('unitName') > b.get('unitName')) return 1;
					if (b.get('unitName') > a.get('unitName')) return -1;

					if (a.get('loadBalancerId') && b.get('loadBalancerId')) {
						return a.get('loadBalancerId') - b.get('loadBalancerId');
					}

					if (a.get('agentName') > b.get('agentName')) return 1;
					if (b.get('agentName') > a.get('agentName')) return -1;

					return 0;
				});*/
				console.log(units);

				self.reset(units);
				defered.resolve();
			});

			return defered.promise();
		}

    });
});