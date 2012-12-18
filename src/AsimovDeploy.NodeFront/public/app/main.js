require([
	"jquery",
	"app",
	"router",
	"socket-con",
	"agentlog",
	"bootstrap",
	"handlebarsHelpers"],
function($, app, Router) {
	
	$(function() {
		
		app.router = new Router();
		app.start();
		
	});

});