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
	"./livelog-list-view",
	"./livelog-filter-view"
],
function($, _, Backbone, Marionette, app, LiveLogListView, LiveLogFilterView) {

	var liveLog = {};

	var agentsCollection = new Backbone.Collection();

	app.addInitializer(function() {

		var agentLogView = new LiveLogListView({ el: $(".live-log") });
		var filterView = new LiveLogFilterView({ collection: agentsCollection, el: $(".live-log-filter-selection") });

		$(".btn-live-log-filter").click(function(event) {
			event.preventDefault();
			$(filterView.el).toggle();
		});

	});

	// PUBLIC API
	liveLog.bootstrap = function(agents) {
		_.each(agents, function(item) {
				agentsCollection.add(new Backbone.Model({ id: item }));
		});
	};

	return liveLog;
});