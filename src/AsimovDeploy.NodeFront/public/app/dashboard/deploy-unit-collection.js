define([
	"jquery",
	"backbone",
	"./deploy-unit"
],
function($, Backbone, DeployUnit) {

	return Backbone.Collection.extend({

		getDeployUnit: function(unitName, agentName) {
			return this.where({
				unitName: unitName,
				agentName: agentName
			})[0];
		},

		fetch: function() {
			var units = [];
			var self = this;
			var defered = $.Deferred();

			$.getJSON('units/list', function(agents) {
				agents.forEach(function(agent) {
					agent.units.forEach(function(unit) {
						units.push(new DeployUnit({
							agentName: agent.name,
							unitName: unit.name,
							url: unit.url,
							status: unit.status,
							deployStatus: unit.deployStatus,
							loadBalancerId: agent.loadBalancerId,
							loadBalancerEnabled: agent.loadBalancerEnabled,
							info: unit.info,
							version: unit.version,
							branch: unit.branch,
							hasDeployParameters: unit.hasDeployParameters
						}));
					});
				});

				units.sort(function(a, b) {
					var a_unitName = a.get('unitName');
					var b_unitName = b.get('unitName');

					if (a.get('unitName') > b.get('unitName')) return 1;
					if (b.get('unitName') > a.get('unitName')) return -1;

					if (a.get('loadBalancerId') && b.get('loadBalancerId')) {
						return a.get('loadBalancerId') - b.get('loadBalancerId');
					}

					if (a.get('agentName') > b.get('agentName')) return 1;
					if (b.get('agentName') > a.get('agentName')) return -1;

					return 0;
				});

				self.reset(units);
				defered.resolve();
			});

			return defered.promise();
		}

    });
});