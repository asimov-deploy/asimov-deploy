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
	"backbone",
	"./verify-log-view",
	"./version-dialog-view",
	"app"
],
function($, Backbone, VerifyLogView, VersionDialogView, app) {

	return Backbone.Marionette.ItemView.extend({
		template: "dashboard/unit-instance-view",
		tagName: "tr",
		className: "deploy-unit-instance",
		events: {
			"click .verify-log-link": "verifyLog",
			"click .select-version": "openDeployLog",
			"click .deploy-log-link": "openDeployLog",
			"click .btn-select": "toggleSelection"
		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render, this);
		},

		verifyLog: function(e) {
			e.preventDefault();
			new VerifyLogView({model: this.model}).show();
		},

		openDeployLog: function(e) {
			e.preventDefault();

			app.vent.trigger('deploylog:show', {
				agentName: this.model.get('agentName'),
				unitName: this.model.get('unitName')
			});
		},

		toggleSelection: function() {
			var selected = this.model.get('selected') || false;
			this.model.set({ selected: !selected });
		}

	});
});