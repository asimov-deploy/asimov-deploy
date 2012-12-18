define([
	"backbone",
	"app",
	"dashboard/dashboard",
	"loadbalancer/loadbalancer",
	"agentlist"
],

function(Backbone, app) {

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'showDashboard',
			'dashboard': 'showDashboard',
			'loadbalancer': 'showLoadbalancer',
			'loadbalancer/settings': 'showLoadbalancerSettings',
			'agents': 'showAgentList'
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

			if (length > 1){
			for(var i = 1; i < length; i++) {
				var arg = routeParts[i];
				if (arg){
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

		// Ensure the protocol is not part of URL, meaning it's relative.
		if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript:") !== 0) {
			// Stop the default event to ensure the link will not cause a page
			// refresh.
			evt.preventDefault();

			// `Backbone.history.navigate` is sufficient for all Routers and will
			// trigger the correct events. The Router's internal `navigate` method
			// calls this anyways.
			Backbone.history.navigate(href, true);
		}
	});

	return AppRouter;

});
