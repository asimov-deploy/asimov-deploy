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

	var LoginCommand = Backbone.Model.extend({
		url: '/login'
	});

	var LoginView = Marionette.ItemView.extend({
		template: "login-view",

		events: {
			"click .btn-login" : "login"
		},

		login: function(e) {
			e.preventDefault();

			var loginCommand = new LoginCommand({
				username: $(".username", this.el).val(),
				password: $(".password", this.el).val()
			});

			loginCommand.save().done(function () {
				if (loginCommand.get('status') !== 'ok') {
					$('.login-error span').text(loginCommand.get('message'));
					$('.login-error').removeClass('hide');
				}
				else {
					app.vent.trigger('dashboard:show');
				}
			});

			return false;
		}

	});

	app.vent.on("login:show", function() {
		app.mainRegion.show(new LoginView());
		app.router.showRoute("login");
	});

	return {};

});