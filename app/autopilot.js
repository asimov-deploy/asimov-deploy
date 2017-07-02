/*******************************************************************************
 * Copyright (C) 2012 eBay Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

var _ = require('underscore');
var when = require('when');

var AutopilotController = function (app, config, agentApiClient) {
    this.getDeployableUnitSets = function () {
        return config.autopilot.deployableUnitSets;
    };

    this.getDeployableUnitSet = function (deployableUnitSetId) {
        var deferred = when.defer();
        var deployableUnitSet = _.findWhere(config.autopilot.deployableUnitSets, { id: deployableUnitSetId });

        when(_getUnits()).then(function (agents) {
            var agentUnits = _.flatten(_.map(agents, function (agent) {
                var result = [];

                _.each(agent.units, function (unit) {
                    result.push({
                        agentName: agent.name,
                        unitName: unit.name
                    });
                });

                return result;
            }));

            var unitsWithInstances =
                _
                .chain(agentUnits)
                .filter(function (item) {
                    return _.contains(deployableUnitSet.units, item.unitName);
                })
                .groupBy('unitName')
                .map(function(agents, unitName) {
                    return {
                        unitName: unitName,
                        instances: _.uniq(_.pluck(agents, 'agentName'))
                    };
                })
                .value();

            var getUnitVersionPromises = [];

            _.each(unitsWithInstances, function (unitWithInstances) {
                getUnitVersionPromises.push(_getUnitVersion(_.first(unitWithInstances.instances), unitWithInstances.unitName));
            });

            when.all(getUnitVersionPromises).then(function (unitVersions) {
                _.each(unitsWithInstances, function (unitWithInstances) {
                    unitWithInstances.selectedVersion = _.findWhere(unitVersions, { unitName: unitWithInstances.unitName }).version;
                });

                var result = [];

                _.each(deployableUnitSet.units, function (unit) {
                    result.push(_.findWhere(unitsWithInstances, { unitName: unit }));
                });

                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    var _getUnits = function () {
        var deferred = when.defer();

        agentApiClient.getUnits(null, function (results) {
            var agents = [];

            results.forEach(function(item) {
                agents.push({
                    name: item.agent.name,
                    loadBalancerState: item.agent.loadBalancerState,
                    units: item.units
                });
            });

            agents = _.sortBy(agents, 'name');

            deferred.resolve(agents);
        });

        return deferred.promise;
    };

    var _getUnitVersion = function (agentName, unitName) {
        var deferred = when.defer();

        agentApiClient.get(agentName, '/versions/' + unitName, function(versions) {
            var version;

            if (config.autopilot.preferredBranch) {
                version = _.findWhere(versions, { branch: config.autopilot.preferredBranch });
            }

            if (!config.autopilot.preferredBranch || !version) {
                version = _.first(versions);
            }

            deferred.resolve({
                agentName: agentName,
                unitName: unitName,
                version: version
            });
        });

        return deferred.promise;
    };
};

module.exports = {
    create: function(app, config, agentApiClient) {
        if (!agentApiClient) {
            agentApiClient = require('./services/agent-api-client').create(config);
        }

        var autopilotController = new AutopilotController(app, config, agentApiClient);

        app.get('/auto-deploy/deployable-unit-sets', app.ensureLoggedIn, function(req, res) {
            res.json(autopilotController.getDeployableUnitSets());
        });

        app.get('/auto-deploy/deployable-unit-sets/:deployableUnitSetId/units', app.ensureLoggedIn, function(req, res) {
            when(autopilotController.getDeployableUnitSet(req.params.deployableUnitSetId)).then(function (result) {
                res.json(result);
            });
        });

        return autopilotController;
    }
};
