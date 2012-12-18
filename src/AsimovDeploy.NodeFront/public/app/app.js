define([
  "jquery",
  "backbone",
  "marionette"
],
function($, Backbone, Marionette) {

	var app = new Marionette.Application();
	
	app.addRegions({
		mainRegion: "#main-region"
	});

	app.addInitializer(function() {
		Backbone.history.start();
	});
	

	$(function() {
		var windowHeight = $(window).height() - 250 - 40;
		$("head").append("<style type='text/css'>.page-content { max-height: " + windowHeight + "px; overflow-y: auto; } </style>");
	});
	
	return app;
	
});
