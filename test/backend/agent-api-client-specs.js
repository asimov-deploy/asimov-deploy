require('should');

var sinon = require('sinon');

describe('AgentApiClient', function(){

	describe('when sending commands', function() {

		var apiClient;
		var jsonClientOptions;
		var jsonClientPostSpy;

		before(function() {
			var fakeConfig = {
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function(options) {
					jsonClientOptions = options;
					jsonClientPostSpy = sinon.spy();
					return { post: jsonClientPostSpy	};
				}
			};

			apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.sendCommand("testAgent", "commandUrl", { p:1, s: 2 }, { id: "myCoolUserId", name: "coolName" });
		});

		it('should send api key in Authorization header', function(){
			jsonClientOptions.headers.Authorization.should.equal('12321313213');
		});

		it('should add userId and userName to parameters', function(){
			jsonClientPostSpy.getCall(0).args[1].userId.should.equal("myCoolUserId");
			jsonClientPostSpy.getCall(0).args[1].userName.should.equal("coolName");
		});

		it('should post command to agent url', function(){
			jsonClientOptions.url.should.equal('agentUrl');
			jsonClientPostSpy.called.should.equal(true);
		});

	});

	describe('when agent has empty unit list', function() {
		var unitListForAgentGroup = [];
		var fakeAgent = { group: "groupName" };
        var expectedUnitList = [];

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgent
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function() {
					return {
						get: function(url, cb) {
							cb(null,null,null,expectedUnitList);
						}
					};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['groupName']}, false, function(results) {
				unitListForAgentGroup = results;
			});
		});

		it('should return empty array (instead of undefined)', function() {
			unitListForAgentGroup.should.deepEqual([
				{
					agent: fakeAgent,
					units: []
				}
			]);
		});

	});

	describe('when agent is not a legacy node agent', function() {
		var unitList = [];
		var fakeAgent = { group: "groupName", isLegacyNodeAgent: false };
		var jsonClientOptions;
		var jsonClientGetSpy;

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgent
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function(options) {
					jsonClientOptions = options;
					jsonClientGetSpy = sinon.spy();
					return { get: jsonClientGetSpy	};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['groupName']}, false, function (results) {
				unitList = results;
			});
		});

		it('should use url with agent group filter to fetch units', function() {
			jsonClientGetSpy.getCall(0).args[0].should.equal('/units/list?agentGroups=groupName');
			jsonClientGetSpy.called.should.equal(true);
		});
	});

	describe('when agent is a legacy node agent', function() {
		var unitList = [];
		var fakeAgent = { group: "groupName", isLegacyNodeAgent: true };
		var jsonClientOptions;
		var jsonClientGetSpy;

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgent
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function(options) {
					jsonClientOptions = options;
					jsonClientGetSpy = sinon.spy();
					return { get: jsonClientGetSpy	};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['groupName']}, false, function (results) {
				unitList = results;
			});
		});

		it('should use legacy url to fetch units', function() {
			jsonClientGetSpy.getCall(0).args[0].should.equal('/units/list');
			jsonClientGetSpy.called.should.equal(true);
		});
	});

	describe('when agent supports extended filtering and filtering units on agent groups and unit groups', function() {
		var unitList = [];
		var fakeAgent = { group: "groupName", supportsFiltering: true };
		var jsonClientOptions;
		var jsonClientGetSpy;

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgent
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function(options) {
					jsonClientOptions = options;
					jsonClientGetSpy = sinon.spy();
					return { get: jsonClientGetSpy	};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['groupName'], unitGroups:['test']}, false, function (results) {
				unitList = results;
			});
		});

		it('should use url with agent group and unit group filters to fetch units', function() {
			jsonClientGetSpy.getCall(0).args[0].should.equal('/units/list?agentGroups=groupName&unitGroups=test');
			jsonClientGetSpy.called.should.equal(true);
		});
	});

	describe('when agent not supports extended filtering and filtering units on agent groups and unit groups', function() {
		var unitList = [];
		var fakeAgent = { group: "groupName", supportsFiltering: false };
		var jsonClientOptions;
		var jsonClientGetSpy;

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgent
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function(options) {
					jsonClientOptions = options;
					jsonClientGetSpy = sinon.spy();
					return { get: jsonClientGetSpy	};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['groupName'], unitGroups:['test']}, false, function (results) {
				unitList = results;
			});
		});

		it('should not call agent', function() {
			//assert(jsonClientGetSpy === undefined);
		});

		it('should return empty array', function() {
			unitList.should.deepEqual([]);
		});
	});

	describe('when multiple agents registered', function() {
		var unitListForAgentGroupOne = [
			{
				name: "test"
			}
		];
		var fakeAgentOne = { groups: ["group1", "group2"] };
		var fakeAgentTwo = { groups: ["group3"] };
        var expectedUnitList = [
			{
				agent: fakeAgentOne,
				units: [
					{
						name: "test"
					}
				]
			}
		];

		before(function() {
			var fakeConfig = {
				agents: [
					fakeAgentOne,
					fakeAgentTwo
				],
				getAgent: function() {
					return { url: 'agentUrl', apiKey: '12321313213' };
				}
			};

			var restify = {
				createJsonClient: function() {
					return {
						get: function(url, cb) {
							cb(null,null,null,unitListForAgentGroupOne);
						}
					};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnits({agentGroups: ['group1']}, false, function(results) {
				unitListForAgentGroupOne = results;
			});
		});

		it('should return units for agent one)', function() {
			unitListForAgentGroupOne.should.deepEqual(expectedUnitList);
		});

	});
});