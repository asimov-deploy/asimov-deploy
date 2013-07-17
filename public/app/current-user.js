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
	"app"
],
function($, Backbone, Marionette, app) {

	var CurrentUserView = Marionette.ItemView.extend({
		template: "current-user-view",

		initialize: function() {
			this.model = new Backbone.Model();
			this.model.set('user', app.initData.user);

			app.vent.on('user:loggedIn', this.userLoggedIn, this);

			this.listenTo(this.model, 'change', this.render, this);
		},

		render: function() {
			$(this.el).toggleClass('dropdown', this.model.get('user') !== undefined);
			Marionette.ItemView.prototype.render.call(this);
		},

		userLoggedIn: function(user) {
			this.model.set('user', user);
		}

	});


	app.addInitializer(function() {
		var view = new CurrentUserView({ el: $("#current-user") });
		view.render();
	});

	return {};
});