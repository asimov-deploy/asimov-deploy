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
	"app"
],
function($, _, Backbone, Marionette, app) {

	var LogItemView = Marionette.ItemView.extend({
		template: "agent-log-item"
	});

	var LogListView = Backbone.View.extend({

		events: {
			"dblclick": "toggleExpand"
		},

		initialize: function(){

			app.vent.on("agent:log", function(logItems) {
				var models = _.map(logItems, function(item) { return new Backbone.Model(item); });
				var views = _.map(models, function(m) { return new LogItemView({model: m}); });

				var fragment = document.createDocumentFragment();
				_.each(views, function(view) {
					view.render();
					fragment.appendChild(view.el);
				});

				this.$el.append(fragment);
				this.$el.scrollTop(this.$el[0].scrollHeight);

			}, this);
		},

		toggleExpand: function(){
			var current = Math.round($(this.el).height()) + "px";
			var min = $(this.el).css("min-height");
			var max = $(this.el).css("max-height");

			if (current == min) {
				$(this.el).animate({ height: max}, 500);
			} else {
				$(this.el).animate({ height: min}, 500);
			}
		}

	});

	app.addInitializer(function() {

		var agentLogView = new LogListView({ el: $(".agent-log") });

	});


});