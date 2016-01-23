require('should');

describe('Autopilot', function() {
	describe('when requesting deployable unit sets', function() {
		var deployableUnitSets;

		before(function() {
			var fakeConfig = {
				autopilot: {
					deployableUnitSets: require('../../app/demo-mode/demo-data-generator').autopilot.deployableUnitSets
				}
			};

			var fakeApp = {
				get: function () {

				}
			};
			var fakeAgentApiClient = {
				get: function (agentName, url, dataCallback) {
					dataCallback(fakeConfig.autopilot.deployableUnitSets);
				}
			};

			var autopilotController = require("../../app/autopilot").create(fakeApp, fakeConfig, fakeAgentApiClient);
			deployableUnitSets = autopilotController.getDeployableUnitSets();
		});

		it('should return a list of configured deployable unit sets', function(){
			deployableUnitSets.length.should.equal(6);

			deployableUnitSets[0].id.should.equal('api_asimov_demo_com');
			deployableUnitSets[1].id.should.equal('asimov_demo_com');
			deployableUnitSets[2].id.should.equal('api_asimov_demo_com_and_asimov_demo_com');
			deployableUnitSets[3].id.should.equal('backend_member_notification');
			deployableUnitSets[4].id.should.equal('backend_queue_handler');
			deployableUnitSets[5].id.should.equal('backend_member_notification_and_backend_queue_handler');
		});
	});

	describe('when requesting deployable unit set with preferredBranch "my-new-feature"', function() {
		var when = require('when');
		var unitsOfDeployableUnitSet;

		before(function() {
			var demoDataGenerator = require('../../app/demo-mode/demo-data-generator');

			var fakeConfig = {
				autopilot: {
					preferredBranch: 'my-new-feature',
					deployableUnitSets: demoDataGenerator.autopilot.deployableUnitSets
				}
			};

			var fakeApp = {
				get: function () {

				}
			};
			var fakeAgentApiClient = {
				get: function (agentName, url, dataCallback) {
					if (url === '/versions/asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['asimov-demo.com']);
					}
					else if (url === '/versions/api.asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['api.asimov-demo.com']);
					}
				},

				getUnitListForAgentGroup: function (groupName, dataCallback) {
					var units = [];

					demoDataGenerator.units.forEach(function (unit) {
						units.push({
							agent: {
								name: unit.name,
								loadBalancerState: unit.loadBalancerState
							},
							units: unit.units
						});
					});

					dataCallback(units);
				}
			};

			var autopilotController = require("../../app/autopilot").create(fakeApp, fakeConfig, fakeAgentApiClient);
			unitsOfDeployableUnitSet = autopilotController.getDeployableUnitSet('api_asimov_demo_com_and_asimov_demo_com');
		});

		it('should return an array of 2 units', function() {
			return when(unitsOfDeployableUnitSet).should.eventually.deepEqual([
				{
					unitName: 'asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '6.7.0',
						timestamp: '2013-06-24 15:26:11',
						branch: 'my-new-feature',
						commit: '14cbf25',
						id: 'mykillerapp-v6.7.0-[master]-[14cbf25].prod.zip'
					}
				},
				{
					unitName: 'api.asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '2.7.0',
						timestamp: '2013-06-24 15:26:11',
						branch: 'my-new-feature',
						commit: '14cbf25',
						id: 'mykillerapp-v2.7.0-[master]-[14cbf25].prod.zip'
					}
				}
			]);
		});
	});

	describe('when requesting deployable unit set with preferredBranch "master"', function() {
		var when = require('when');
		var unitsOfDeployableUnitSet;

		before(function() {
			var demoDataGenerator = require('../../app/demo-mode/demo-data-generator');

			var fakeConfig = {
				autopilot: {
					preferredBranch: 'master',
					deployableUnitSets: demoDataGenerator.autopilot.deployableUnitSets
				}
			};

			var fakeApp = {
				get: function () {

				}
			};
			var fakeAgentApiClient = {
				get: function (agentName, url, dataCallback) {
					if (url === '/versions/asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['asimov-demo.com']);
					}
					else if (url === '/versions/api.asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['api.asimov-demo.com']);
					}
				},

				getUnitListForAgentGroup: function (groupName, dataCallback) {
					var units = [];

					demoDataGenerator.units.forEach(function (unit) {
						units.push({
							agent: {
								name: unit.name,
								loadBalancerState: unit.loadBalancerState
							},
							units: unit.units
						});
					});

					dataCallback(units);
				}
			};

			var autopilotController = require("../../app/autopilot").create(fakeApp, fakeConfig, fakeAgentApiClient);
			unitsOfDeployableUnitSet = autopilotController.getDeployableUnitSet('api_asimov_demo_com_and_asimov_demo_com');
		});

		it('should return an array of 2 units', function() {
			return when(unitsOfDeployableUnitSet).should.eventually.deepEqual([
				{
					unitName: 'asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '7.1.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v7.1.0-[master]-[14cbf27].prod.zip'
					}
				},
				{
					unitName: 'api.asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '3.0.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip'
					}
				}
			]);
		});
	});

	describe('when requesting deployable unit set with preferredBranch that do not exists', function() {
		var when = require('when');
		var unitsOfDeployableUnitSet;

		before(function() {
			var demoDataGenerator = require('../../app/demo-mode/demo-data-generator');

			var fakeConfig = {
				autopilot: {
					preferredBranch: 'does-not-exists',
					deployableUnitSets: demoDataGenerator.autopilot.deployableUnitSets
				}
			};

			var fakeApp = {
				get: function () {

				}
			};
			var fakeAgentApiClient = {
				get: function (agentName, url, dataCallback) {
					if (url === '/versions/asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['asimov-demo.com']);
					}
					else if (url === '/versions/api.asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['api.asimov-demo.com']);
					}
				},

				getUnitListForAgentGroup: function (groupName, dataCallback) {
					var units = [];

					demoDataGenerator.units.forEach(function (unit) {
						units.push({
							agent: {
								name: unit.name,
								loadBalancerState: unit.loadBalancerState
							},
							units: unit.units
						});
					});

					dataCallback(units);
				}
			};

			var autopilotController = require("../../app/autopilot").create(fakeApp, fakeConfig, fakeAgentApiClient);
			unitsOfDeployableUnitSet = autopilotController.getDeployableUnitSet('api_asimov_demo_com_and_asimov_demo_com');
		});

		it('should return an array of 2 units', function() {
			return when(unitsOfDeployableUnitSet).should.eventually.deepEqual([
				{
					unitName: 'asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '7.1.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v7.1.0-[master]-[14cbf27].prod.zip'
					}
				},
				{
					unitName: 'api.asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '3.0.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip'
					}
				}
			]);
		});
	});

	describe('when requesting deployable unit set without preferredBranch', function() {
		var when = require('when');
		var unitsOfDeployableUnitSet;

		before(function() {
			var demoDataGenerator = require('../../app/demo-mode/demo-data-generator');

			var fakeConfig = {
				autopilot: {
					deployableUnitSets: demoDataGenerator.autopilot.deployableUnitSets
				}
			};

			var fakeApp = {
				get: function () {

				}
			};
			var fakeAgentApiClient = {
				get: function (agentName, url, dataCallback) {
					if (url === '/versions/asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['asimov-demo.com']);
					}
					else if (url === '/versions/api.asimov-demo.com') {
						dataCallback(demoDataGenerator.versions['api.asimov-demo.com']);
					}
				},

				getUnitListForAgentGroup: function (groupName, dataCallback) {
					var units = [];

					demoDataGenerator.units.forEach(function (unit) {
						units.push({
							agent: {
								name: unit.name,
								loadBalancerState: unit.loadBalancerState
							},
							units: unit.units
						});
					});

					dataCallback(units);
				}
			};

			var autopilotController = require("../../app/autopilot").create(fakeApp, fakeConfig, fakeAgentApiClient);
			unitsOfDeployableUnitSet = autopilotController.getDeployableUnitSet('api_asimov_demo_com_and_asimov_demo_com');
		});

		it('should return an array of 2 units', function() {
			return when(unitsOfDeployableUnitSet).should.eventually.deepEqual([
				{
					unitName: 'asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '7.1.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v7.1.0-[master]-[14cbf27].prod.zip'
					}
				},
				{
					unitName: 'api.asimov-demo.com',
				    instances: [ 'SE1-WEBFRONT-01', 'SE1-WEBFRONT-02', 'SE1-WEBFRONT-03', 'SE1-WEBFRONT-04', 'SE1-WEBFRONT-05' ],
				    selectedVersion: {
						version: '3.0.0',
						timestamp: '2013-06-28 16:26:11',
						branch: 'master',
						commit: '14cbf27',
						id: 'mykillerapp-v3.0.0-[master]-[14cbf27].prod.zip'
					}
				}
			]);
		});
	});
});