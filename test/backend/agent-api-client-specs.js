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
							cb();
						}
					};
				}
			};

			var apiClient = require("../../app/services/agent-api-client").create(fakeConfig, restify);

			apiClient.getUnitListForAgentGroup("groupName", function(results) {
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

});