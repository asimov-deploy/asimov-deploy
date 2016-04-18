/* beforeAll monkeyPatch */
var beforeAll = function (func) {
    var beforeAllCalled = false;

    jasmine.getEnv().currentSuite.beforeEach(function () {
        if (!beforeAllCalled) {
            beforeAllCalled = true;
            func.call(this);
        }
    });
};

var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/specs\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    baseUrl: '/base/app',

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

    // start test run, once Require.js is done
    callback: function () {
        require(tests, window.__karma__.start)
    }
});