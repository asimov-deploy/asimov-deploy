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

        var agents = [];

        agentApiClient.getUnitListForAgentGroup(null, function(results) {
            results.forEach(function(item) {
                agents.push({
                    name: item.agent.name,
                    loadBalancerState: item.agent.loadBalancerState,
                    units: item.units
                });
            });

        });

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
            .groupBy('unitName')
            .map(function(agentUnits, unitName) {
                agentApiClient.get(_.first(agentUnits), '/versions/' + unitName, function(versions) {
                    var version = null;

                    if (config.autopilot.preferredBranch) {
                        version = _.findWhere(versions[unitName], { branch: config.autopilot.preferredBranch });
                    }
                    else {
                        version = _.first(versions[unitName]);
                    }

                    return {
                        unitName: unitName,
                        instances: _.pluck(agentUnits, 'agentName'),
                        selectedVersion: version
                    };
                });
            })
            .value();

        var result = [];

        _.each(deployableUnitSet.units, function (unit) {
            result.push(_.findWhere(unitsWithInstances, { unitName: unit }));
        });

        res.json(result);
    });
};