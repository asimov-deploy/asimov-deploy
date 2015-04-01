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
	"underscore",
	"app",
	"./unit-list-view",
	"./unit-collection"
],
function(_, app, UnitListView, UnitCollection) {

	var unitCollection = new UnitCollection();
	var dashboard = {};

	// events
	app.vent.on("group-changed", function() {
		unitCollection.fetch();
	});

	app.vent.on("agent:event:deployStarted", function(data) {
		var unit = unitCollection.getUnitInstance(data.unitName, data.agentName);
		unit.deployStarted(data);
	});

	app.vent.on("agent:event:deployFailed", function(data) {
		var unit = unitCollection.getUnitInstance(data.unitName, data.agentName);
		unit.deployFailed(data);
	});

	app.vent.on("agent:event:deployCompleted", function(data) {
		var unit = unitCollection.getUnitInstance(data.unitName, data.agentName);
		unit.deployCompleted(data);
	});

	app.vent.on("agent:event:loadBalancerStateChanged", function(data) {
		unitCollection.forEach(function(unit) {
			unit.get('instances').forEach(function(instance) {
				if (instance.get('agentName') === data.agentName) {
					instance.set({ loadBalancerState: data.state });
					instance.set({ showAsChanging: false });
				}
			});
		});
	});

	app.vent.on("agent:event:unitStatusChanged", function(data) {
		var unit = unitCollection.getUnitInstance(data.unitName, data.agentName);
		unit.changeStatus(data.status);
	});

	app.vent.on("agent:event:verify-progress", function(data) {
		var unit = unitCollection.getUnitInstance(data.unitName, data.agentName);
		var steps = unit.get("verifySteps") || [];

		steps = steps.slice(0);
		steps.push(data);

		if (data.started) { steps = []; }

		unit.set({verifySteps: steps});
	});

	app.vent.on("dashboard:show", function() {
		var view = new UnitListView({ collection: unitCollection });
		app.mainRegion.show(view);

		if (unitCollection.length === 0) {
			unitCollection.fetch();
		}

		app.router.showRoute("dashboard");
	});

	return dashboard;

});