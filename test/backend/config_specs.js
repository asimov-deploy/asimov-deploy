

describe('config', function(){

	var AsimovConfig = require("../../app/config").Config;
	var config = new AsimovConfig();

	require('should');

	before(function() {
		config.agents.push({ name: "Hello", loadBalancerId: 2 });
		config.agents.push({ name: "Test", loadBalancerId: 5 });
	});

	describe('getAgent', function(){

		it('should return agent by name', function(){
			var agent = config.getAgent({name: "Hello"});
			var agent2 = config.getAgent({name: "Test"});
			agent.name.should.equal("Hello");
			agent2.name.should.equal("Test");
		});

		it('should return agent by loadBalancerId', function(){
			var agent = config.getAgent({loadBalancerId: 5});
			var agent2 = config.getAgent({loadBalancerId: 2});
			agent.name.should.equal("Test");
			agent2.name.should.equal("Hello");
		});

	});

	describe("loadBalancerStatusChanged", function() {

		it("should update loadbalancer status", function() {
			config.loadBalancerStatusChanged(5, true);
			config.getAgent({loadBalancerId: 5}).loadBalancerEnabled.should.equal(true);
		});

	});

	it('Enable demo should be false by default', function() {
		config.enableDemo.should.equal(false);
	});
});