require.config({
	baseUrl: '../../public/app',

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

		'socket.io': '../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io',

		specs: '../../test/ui/specs'
	},

	shim: {
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		bootstrap: {
			deps:["jquery"]
		}
	},

	urlArgs: 'bust=' +  (new Date()).getTime()

});
