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

require([
	"jquery",
	"app",
	"router",
	"backbone",
	"socket-con",
	"livelog/livelog",
	"bootstrap",
	"handlebarsHelpers",
	"current-user",
	"group-selection"
],
function($, app, Router, Backbone) {

	$(function() {

		app.initData = JSON.parse($('#init-data').val());

		app.on('initialize:after', function() {
			app.router = new Router();
			Backbone.history.start();
		});


		app.start();
	});

});