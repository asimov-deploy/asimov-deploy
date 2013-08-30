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
	"marionette",
	"app",
	"../collections/agent-query-collection"
],
function($, _, Backbone, Marionette, app, AgentQueryCollection) {

	var DeployLogItemView = Marionette.ItemView.extend({
		template: "dashboard/deploy-log-item-view",
		tagName: "tr",
		events: {
			"click td": "openLog"
		},

		openLog: function() {
			this.trigger("openLog");
		}
	});

	return Marionette.CompositeView.extend({
		itemView: DeployLogItemView,
		template: "dashboard/deploy-log-view",
		itemViewContainer: "tbody",

		events: {
			"click .btn-close": "close"
		},

		initialize: function(options) {

			this.agentName = options.agentName;
			this.unitName = options.unitName;
			this.on("itemview:openLog", this.openLog, this);

			this.collection = new AgentQueryCollection({
				agentUrl: "/deploylog/list/:unitName",
				agentName: options.agentName,
				unitName: options.unitName
			});

			this.collection.fetch();
		},

		serializeData: function() {
			return { agentName: this.agentName, unitName: this.unitName };
		},

		openLog: function(itemView) {
			var params = {
				unitName: this.unitName,
				agentName: this.agentName,
				position: itemView.model.get("position")
			};

			window.open("/deploylog/file?" + $.param(params));
		},

		show: function() {
			this.render();
			$(".modal")
				.addClass('deploy-log-dialog')
				.modal("show");
		},

		close: function() {
			$(".modal")
				.removeClass('deploy-log-dialog')
				.modal("hide");
			this.undelegateEvents();
		}

	});



});