require('should');

describe('config module', function(){

	var AsimovConfig = require("../../app/config").Config;

	describe('given config with 2 agents', function() {

		var config = new AsimovConfig();

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

	describe('config with 3 instances', function() {

		var config = new AsimovConfig({
			instances: [
				{ name: 'instance1', port: 3334 },
				{ name: 'instance2', port: 3335 },
				{ name: 'instance3', port: 3336 }
			]
		});

		it('start name and port should be from first instance', function() {
			config.name.should.equal('instance1');
			config.port.should.equal(3334);
		});

		it('after nextInstance is called, name and port should be from second instance', function() {
			config.nextInstance();
			config.name.should.equal('instance2');
			config.port.should.equal(3335);
		});

	});


});