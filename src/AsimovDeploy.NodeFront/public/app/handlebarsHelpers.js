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
	"marionette"
],
function(Marionette) {

	Marionette.Renderer = {
		render: function (template, data) {
			return Handlebars.templates[template](data);
		}
	};

	Handlebars.registerHelper('ifEqFalse', function(conditional, options) {
		if(conditional === false) {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifUndefined', function(conditional, options) {
		if(conditional === undefined) {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifDeploying', function(options) {
		if(this.status === "Deploying") {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifTypeText', function(conditional, options) {
		if(conditional === "text") {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifTypePassword', function(conditional, options) {
		if(conditional === "password") {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('iconForUnitAction', function(object) {
		if (object === "Stop") return "icon-off";
		if (object === "Start") return "icon-play-circle";
		if (object === "Verify") return "icon-heart";
		return "";
	});

	return {};

});