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
    "marionette"
],
function($, Marionette) {

	return Marionette.ItemView.extend({
		template: "dashboard/unit-header-view",
		events: {
			"click .btn-select": "toggleSelectAll"
		},

		initialize: function(options) {
			this.instances = options.instances;
			this.instances.on("change:selected", this.selectionChanged, this);
			this.model.on("change", this.render, this);
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

			if (allSelected) {
				this.instances.forEach(function(instance) {
					instance.set({selected: false});
				});
			}
			else {
				this.instances.forEach(function(instance) {
					instance.set({selected: true});
				});
			}
		}

	});

});
