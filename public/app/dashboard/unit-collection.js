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
	"app",
	"./unit-instance"
],
function($, _, Backbone, app, UnitInstance) {

	var UnitInstanceCollection = Backbone.Collection.extend({
		comparator: function(a) {
			return a.get('agentName');
		}
	});

	return Backbone.Collection.extend({

		getUnitInstance: function(unitName, agentName) {
			return this.instanceIndex[agentName + unitName];
		},

		addOrGetUnit: function(name, actions, tempList) {
			var unit = _.find(tempList, function (item) { return item.name === name; });
			if (!unit) {
				unit = {
					name: name,
					actions: actions,
					instances: new UnitInstanceCollection()
				};
				tempList.push(unit);
			}

			return unit;
		},

		createUnitInstance: function (agent, instance) {
			return new UnitInstance({
				unitName: instance.name,
				agentName: agent.name,
				url: instance.url,
				status: instance.status,
				deployStatus: instance.deployStatus,
				loadBalancerState: agent.loadBalancerState,
				lastDeployed: instance.lastDeployed,
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
			var tempList = [];
			var self = this;
			var defered = $.Deferred();

			$.ajax({
				type: 'GET',
				url: "/units/list",
				data: $.param({group: app.currentGroup}),
				dataType: 'json'
			}).done(function(agents) {
				agents.forEach(function(agent) {
					agent.units.forEach(function(instance) {
						var unit = self.addOrGetUnit(instance.name, instance.actions, tempList);
						var unitInstance = self.createUnitInstance(agent, instance);

						unit.instances.add(unitInstance);
						self.addInstanceToIndex(unitInstance);
					});
				});

				tempList.sort(function(a, b) {
					if (a.name > b.name) { return 1; }
					if (b.name > a.name) { return -1; }
					return 0;
				});

				self.reset(tempList);
				defered.resolve();
			});

			return defered.promise();
		}

	});
});