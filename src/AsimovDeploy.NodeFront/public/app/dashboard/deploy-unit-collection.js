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
	"./deploy-unit-instance"
],
function($, _, Backbone, DeployUnitInstance) {

	return Backbone.Collection.extend({

		getUnitInstance: function(unitName, agentName) {
			return this.instanceIndex[agentName + unitName];
		},

		addOrGetUnit: function(name, actions, tempList) {
			unit = _.find(tempList, function (item) { return item.name == name; });
			if (!unit) {
				unit = {
					name: name,
					actions: actions,
					instances: new Backbone.Collection()
				};
				tempList.push(unit);
			}

			return unit;
		},

		createUnitInstance: function (agent, instance) {
			return new DeployUnitInstance({
				unitName: instance.name,
				agentName: agent.name,
				url: instance.url,
				status: instance.status,
				deployStatus: instance.deployStatus,
				loadBalancerId: instance.loadBalancerId,
				loadBalancerEnabled: instance.loadBalancerEnabled,
				info: instance.info,
				version: instance.version,
				branch: instance.branch,
				actions: instance.actions,
				hasDeployParameters: instance.hasDeployParameters
			});
		},

		addInstanceToIndex: function(unitInstance) {
			this.instanceIndex = this.instanceIndex || {};
			var key = unitInstance.get('agentName') + unitInstance.get('unitName');
			this.instanceIndex[key] = unitInstance;
		},

		fetch: function() {
			var units = [];
			var self = this;
			var defered = $.Deferred();

			$.getJSON('units/list', function(agents) {
				agents.forEach(function(agent) {
					agent.units.forEach(function(instance) {
						var unit = self.addOrGetUnit(instance.name, instance.actions, units);
						var unitInstance = self.createUnitInstance(agent, instance);

						unit.instances.push(unitInstance);
						self.addInstanceToIndex(unitInstance);
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