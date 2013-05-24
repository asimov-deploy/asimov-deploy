// Flight Test runner
// Loads the tests (as modules) with Loadrunner.
// Loadrunner won't start executing until all modules validly export, so no additional
// sanity check is needed.
var jasmineStarted;
var jasmineErrored;

function startJasmine() {
	var jasmineEnv = jasmine.getEnv();
	if (!jasmineStarted) {
		jasmineEnv.updateInterval = 1000;

		jasmineEnv.execute();
		jasmineStarted = true;
	}
}

function runTests(tests) {
	requirejs(tests, startJasmine)
}

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

window.onerror = function(errorMsg, url, lineNumber) {
	if (errorMsg == 'setting a property that has only a getter') {
		//Selenium's plugin for Firefox 3.6 throws this error
		return;
	}

	//don't add more describes for additional cascading errors,
	//otherwise the suite that's already in progress will never end
	if (jasmineErrored) {
		return;
	} else {
		jasmineErrored = true; // :(
	}

	describe('JavaScript console error', function(){
		var urlString = url ? url : "unknown";
		it("was thrown in url '"+ urlString + "' at line '" + lineNumber + "'", function() {
			this.fail(new Error(errorMsg + " (Try looking in the console for more specific debug info; the stack trace below is not super helpful.)"));
		});
	});

	startJasmine();
};


jasmine.getEnv().addReporter(new jasmine.BootstrapReporter());

if (document.location.href.indexOf('phantomjs=true') !== -1) {
	window.consoleReporter = new jasmine.ConsoleReporter();
	jasmine.getEnv().addReporter(consoleReporter);
	jasmine.getEnv().addReporter(new jasmine.TeamcityReporter());
}

require(['jquery'], function($) {
	runTests(specs);
});