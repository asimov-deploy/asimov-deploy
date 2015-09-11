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

define([
    "underscore",
    "when",
    "when/sequence",
    "backbone",
    "app",
    "../task-aborted-exception"
],
function(_, when, sequence, Backbone, app, TaskAbortedException) {
    var DeployCommand = Backbone.Model.extend({
        url: "/deploy/deploy"
    });

    var createDeployUnitToAgentsTask = function (agents, unit) {
        return function() {
            var deferreds = [];

            _.each(agents, function (agentName) {
                deferreds.push(deployUnitForAgent(agentName, unit.unitName, unit.versionId));
            });

            return when.all(deferreds).delay(1000);
        };
    };

    var deployUnitForAgent = function(agentName, unitName, versionId) {
        var deferred = when.defer();

        new DeployCommand({
            agentName: agentName,
            unitName: unitName,
            versionId: versionId
        }).save();

        var dispose = function () {
            app.vent.off('agent:event:deployCompleted', deployCompleted);
            app.vent.off('agent:event:deployFailed', deployFailed);
            app.vent.off('autopilot:abort-deploy', abort);
        };

        var deployCompleted = function (data) {
            if (data.agentName === agentName &&
                data.unitName === unitName) {
                dispose();
                deferred.resolve({
                    agentName: agentName,
                    unitName: unitName,
                    versionId: versionId
                });
            }
        };

        var deployFailed = function (data) {
            if (data.agentName === agentName &&
                data.unitName === unitName) {
                dispose();
                deferred.reject({
                    agentName: agentName,
                    unitName: unitName,
                    versionId: versionId
                });
            }
        };

        var abort = function () {
            dispose();
            deferred.reject(new TaskAbortedException());
        };

        app.vent.on('agent:event:deployCompleted', deployCompleted);
        app.vent.on('agent:event:deployFailed', deployFailed);
        app.vent.on('autopilot:abort-deploy', abort);

        return deferred.promise;
    };

    return {
        execute: function (task) {
            var tasks = [];

            _.each(task.units, function (unit) {
                tasks.push(createDeployUnitToAgentsTask(task.agents, unit));
            });

            return sequence(tasks);
        },

        getInfo: function () {
            return {
                title: 'Deploy unit set',
                description: 'Deploys version for each unit in set'
            };
        }
    };
});