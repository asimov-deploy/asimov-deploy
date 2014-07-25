require('should');

describe('Config', function(){

	var AsimovConfig = require("../../app/config").Config;

	describe('given config with 2 agents', function() {

		var config = new AsimovConfig();

		before(function() {
			config.agents.push({ name: "Test", loadBalancerId: 5 });
			config.agents.push({ name: "Hello", loadBalancerId: 2 });
		});

		describe('getAgent', function(){

			it('should return agent by name', function(){
				var agent = config.getAgent("Hello");
				var agent2 = config.getAgent("Test");
				agent.name.should.equal("Hello");
				agent2.name.should.equal("Test");
			});

		});

		describe('getAgentList', function(){
			it('should return a list of agents sorted alphabetically', function(){
				var agentList = config.getAgentList();

				agentList[0].name.should.equal("Hello");
				agentList[1].name.should.equal("Test");
			});
		});

	});

	describe('config defaults', function() {

		var config = new AsimovConfig();

		it('Enable demo should be false by default', function() {
			config['enable-demo'].should.equal(false);
		});

		it('Should have default port and name', function() {
			config.name.should.equal('Deploy UI');
			config.port.should.equal(3333);
		});

	});


});