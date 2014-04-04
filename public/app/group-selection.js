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
	"marionette",
	"app",
	"underscore"
],
function($, Backbone, Marionette, app, _) {

	var GroupSelectionView = Marionette.ItemView.extend({
		events: {
			"click .change-group-btn": "changeGroup"
		},

		initialize: function() {
		},

		render: function() {
			var toggle = $('<a class="dropdown-toggle" data-toggle="dropdown" href="#">' + app.currentGroup + '</a>');
			var ul = $('<ul class="dropdown-menu"></ul>');

			_.each(app.initData.groups, function(group) {
				ul.append($('<li><a href="#" class="change-group-btn">' + group + '</a></li>'));
			});

			$(this.el).html('');
			$(this.el).append(toggle);
			$(this.el).append(ul);
		},

		changeGroup: function(e) {
			app.currentGroup = $(e.target).text();
			localStorage.setItem('current-group', app.currentGroup);

			this.render();
			app.vent.trigger('group-changed');
		}
	});


	app.addInitializer(function() {
		app.currentGroup = localStorage.getItem('current-group');
		if (!app.currentGroup) {
			if (app.initData.groups) {
				app.currentGroup = app.initData.groups[0];
			}
			else {
				app.currentGroup = 'NA';
			}
		}

		var view = new GroupSelectionView({ el: $("#instance-selection") });
		view.render();
	});

	return {};

});