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
	"app",
	"dashboard/dashboard",
	"loadbalancer/loadbalancer",
	"agentlist"
],

function($, Backbone, app) {

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'showDashboard',
			'dashboard': 'showDashboard',
			'loadbalancer': 'showLoadbalancer',
			'loadbalancer/settings': 'showLoadbalancerSettings',
			'agents': 'showAgentList',
			'login': 'showLogin'
		},

		initialize: function(){
		},

		showDashboard: function() {
			app.vent.trigger("dashboard:show");
		},

		showLoadbalancer: function() {
			app.vent.trigger("loadbalancer:show");
		},

		showLoadbalancerSettings: function() {
			app.vent.trigger("loadbalancer:settings:show");
		},

		showLogin: function() {
			app.vent.trigger("login:show");
		},

		showAgentList: function() {
			app.vent.trigger("agentlist:show");
		},

		showRoute: function(path) {
			var route = this.getRoutePath(arguments);
			Backbone.history.navigate(route, false);

			$(".nav li.active").removeClass("active");
			$(".nav a[href='" + path + "']").parent().addClass("active");
		},

		getRoutePath: function(routeParts) {
			var base = routeParts[0];
			var length = routeParts.length;
			var route = base;

			if (length > 1) {
				for(var i = 1; i < length; i++) {
					var arg = routeParts[i];
					if (arg) {
						route = route + "/" + arg;
					}
				}
			}

			return route;
		}

	});


	$(document).on("click", "a:not([data-bypass])", function(evt) {
		// Get the anchor href and protcol
		var href = $(this).attr("href");
		var protocol = this.protocol + "//";

		if (href && href.slice(0, protocol.length) !== protocol) {
			evt.preventDefault();
			Backbone.history.navigate(href, true);
		}
	});

	return AppRouter;

});
