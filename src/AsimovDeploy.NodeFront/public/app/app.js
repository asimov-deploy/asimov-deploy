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
		var windowHeight = $(window).height() - 181 - 60 - 41 - 20;
		$("head").append("<style type='text/css'>.page-content { max-height: " + windowHeight + "px; } </style>");
	});

	return app;

});
