var deps = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (/(specs)\.js$/i.test(file)) {
        deps.push(file);
    }
});

require.config({
    baseUrl: '/base/public/app',

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

    },

    deps: deps,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});