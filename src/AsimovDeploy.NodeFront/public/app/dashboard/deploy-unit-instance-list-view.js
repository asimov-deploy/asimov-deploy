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
    "./deploy-unit-view",
    "app"
],
function($, Marionette, DeployUnitView, app) {

	var DeployUnitHeaderView = Marionette.ItemView.extend({
		template: "deploy-unit-header"
	});

	return Marionette.CompositeView.extend({
		itemView: DeployUnitView,
		template: "deploy-unit-instance-list",
		tagName: "tbody",
		className: "deploy-unit",

		events: {
			"click .deploy-unit-link": "toggleExpand"
		},

		initialize: function() {
			this.collection =  this.model.get("instances");
			this.on("composite:model:rendered", this.createControlsView, this);
			//this.$el.toggleClass("deploy-unit-collapsed", this.getToggleState());
		},

		createControlsView: function() {
			var element = this.$el.find(".deploy-unit-row");
			var view = new DeployUnitHeaderView({
					el: element,
					model: new Backbone.Model({
						name: this.model.get('name'),
						actions: this.model.get('actions')
					})
			});
			view.render();

			this.controlsView = view;
		},

		getToggleState: function() {
			if (!localStorage)
				return true;

			var value = localStorage.getItem('deploy-unit-collapsed-state-' + this.model.get('name'));
			return value ? value == "true" : true;
		},

		toggleExpand: function(e) {
			e.preventDefault();
			this.$el.toggleClass("deploy-unit-collapsed");
			this.saveToggleState();
		},

		saveToggleState: function() {
			if (localStorage) {
				localStorage.setItem('deploy-unit-collapsed-state-' + this.model.get('name'), this.$el.hasClass("deploy-unit-collapsed"));
			}
		}

	});


});