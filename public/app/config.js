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

require.config({

	deps: ["main"],

	paths: {
		// JavaScript folders
		libs: "../libs",

		// Libraries
		jquery: "../libs/jquery",
		underscore: "../libs/lodash",
		bootstrap: "../libs/bootstrap",
		backbone: "../libs/backbone",
		marionette: "../libs/backbone.marionette",
		"backbone.babysitter": "../libs/backbone.babysitter",
		"backbone.wreqr": "../libs/backbone.wreqr",
		"jquery.cookie": "../libs/jquery.cookie",
		"select2": "../libs/select2",

		'socket.io': '../../node_modules/socket.io-client/dist/socket.io'
	},

	packages: [
		{ name: 'when', location: '../../node_modules/when', main: 'when' }
	],

	shim: {
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},

		bootstrap: {
			deps:["jquery"]
		}

	}

});



