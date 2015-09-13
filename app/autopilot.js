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

module.exports = function(app, config) {
    var _ = require('underscore');
    var agentApiClient = require('./services/agent-api-client').create(config);

    app.get('/auto-deploy/deployable-unit-sets', app.ensureLoggedIn, function(req, res) {
        res.json(config.autopilot.deployableUnitSets);
    });

    app.get('/auto-deploy/deployable-unit-sets/:deployableUnitSetId/units', app.ensureLoggedIn, function(req, res) {
        var deployableUnitSet = _.findWhere(config.autopilot.deployableUnitSets, { id: req.params.deployableUnitSetId });

        agentApiClient.getUnitListForAgentGroup(null, function(results) {
            var agents = [];

            results.forEach(function(item) {
                agents.push({
                    name: item.agent.name,
                    loadBalancerState: item.agent.loadBalancerState,
                    units: item.units
                });
            });

            agents = _.sortBy(agents, 'name');

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
                        instances: _.pluck(agents, 'agentName')
                    };
                })
                .value();

            var unitVersions = {};

            _.each(unitsWithInstances, function (unitWithInstances) {
                agentApiClient.get(_.first(unitWithInstances.instances), '/versions/' + unitWithInstances.unitName, function(versions) {
                    var version;

                    if (config.autopilot.preferredBranch) {
                        version = _.findWhere(versions, { branch: config.autopilot.preferredBranch });
                    }
                    else {
                        version = _.first(versions);
                    }

                    unitVersions[unitWithInstances.unitName] = version;

                    if (Object.keys(unitVersions).length === unitsWithInstances.length) {
                        finish(res, deployableUnitSet, unitsWithInstances, unitVersions);
                    }
                });
            });
        });
    });

    var finish = function (res, deployableUnitSet, unitsWithInstances, unitVersions) {
        _.each(unitsWithInstances, function (unitWithInstances) {
            unitWithInstances.selectedVersion = unitVersions[unitWithInstances.unitName];
        });

        var result = [];

        _.each(deployableUnitSet.units, function (unit) {
            result.push(_.findWhere(unitsWithInstances, { unitName: unit }));
        });

        res.json(result);
    };
};