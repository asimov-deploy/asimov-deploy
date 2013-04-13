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
	"marionette",
	"./version-dialog-view",
	"./confirm-deploy-view"
],
function($, Marionette, VersionDialogView, ConfirmDeployView) {

	var AgentActionCommand = Backbone.Model.extend({
		url: "/agent/action"
	});

	return Marionette.ItemView.extend({
		template: "dashboard/unit-header-view",
		events: {
			"click .btn-select": "toggleSelectAll",
			"click .btn-select-version": "selectVersion",
			"click .btn-unit-action": "unitAction"
		},

		initialize: function(options) {
			this.instances = options.instances;
			this.instances.on("change:selected", this.selectionChanged, this);
			this.model.on("change", this.render, this);
			this.selectionChanged();
		},

		selectionChanged: function() {
			var selectedInstances = this.instances.where({selected: true});
			var anySelected = selectedInstances.length > 0;
			var allSelected = selectedInstances.length === this.instances.length;

			this.model.set({showActions: anySelected, allSelected: allSelected});
		},

		toggleSelectAll: function() {
			var selectedInstances = this.instances.where({selected: true});
			var allSelected = selectedInstances.length === this.instances.length;

			this.instances.forEach(function(instance) {
				instance.set({selected: !allSelected});
			});
		},

		deploy: function() {
			var selectedInstances = this.instances.where({selected: true});
			var confirmView = new ConfirmDeployView({ unitInstances: selectedInstances });
			confirmView.show();
		},

		selectVersion: function () {
			var instance = this.instances.first();
			var versionView = new VersionDialogView({ agentName: instance.get('agentName'), unitName: instance.get('unitName') });
			versionView.on("versionSelected", this.versionSelected, this);
			versionView.show();
		},

		versionSelected: function(versionId, version, branch) {
			this.instances.forEach(function(instance) {
				if (instance.get('selected')) {
					instance.set({
						deployInfo: {
							version: version,
							versionId: versionId,
							branch: branch
						}
					});
				}
			});

			this.deploy();
		},

		unitAction: function(e) {
			e.preventDefault();

			var selectedInstances = this.instances.where({selected: true});
			var actionName = $(e.currentTarget).data("action-name");

			this.instances.forEach(function(instance) {

				new AgentActionCommand({
					agentName: instance.get("agentName"),
					unitName: instance.get("unitName"),
					actionName: actionName
				}).save();

			});
		}


	});

});
