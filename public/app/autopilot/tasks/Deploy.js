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
    "../../deploys/deploy-command",
    "../task-aborted-exception"
],
function(_, when, sequence, DeployCommand, TaskAbortedException) {
    var DeployTask = function (config, eventAggregator) {
        var _createDeployUnitToAgentsTask = function (agents, unit) {
            return function() {
                var deferreds = [];

                _.each(agents, function (agentName) {
                    deferreds.push(_deployUnitForAgent(agentName, unit.unitName, unit.versionId));
                });

                return when.all(deferreds).delay(config.deployPostDelay);
            };
        };

        var _deployUnitForAgent = function(agentName, unitName, versionId) {
            var retries = 0;
            var deferred = when.defer();

            new DeployCommand({
                agentName: agentName,
                unitName: unitName,
                versionId: versionId
            }).save();

            var dispose = function () {
                eventAggregator.off('agent:event:deployCompleted', deployCompleted);
                eventAggregator.off('agent:event:deployFailed', deployFailed);
                eventAggregator.off('autopilot:continue-deploy', continueDeploy);
                eventAggregator.off('autopilot:abort-deploy', abort);
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
                    if (config.deployRetryOnFailure && retries < config.deployFailureRetries) {
                        retries++;
                        new DeployCommand({
                            agentName: agentName,
                            unitName: unitName,
                            versionId: versionId
                        }).save();
                    }
                    else {
                        eventAggregator.trigger('autopilot:pause-deploy');
                    }
                }
            };

            var continueDeploy = function () {
                dispose();
                deferred.resolve({
                    agentName: agentName,
                    unitName: unitName,
                    versionId: versionId
                });
            };

            var abort = function () {
                dispose();
                deferred.reject(new TaskAbortedException());
            };

            eventAggregator.on('agent:event:deployCompleted', deployCompleted);
            eventAggregator.on('agent:event:deployFailed', deployFailed);
            eventAggregator.on('autopilot:continue-deploy', continueDeploy);
            eventAggregator.on('autopilot:abort-deploy', abort);

            return deferred.promise;
        };

        this.execute = function (taskData) {
            return function() {
                var tasks = [];

                _.each(taskData.units, function (unit) {
                    tasks.push(_createDeployUnitToAgentsTask(taskData.agents, unit));
                });

                return sequence(tasks);
            };
        };
    };

    DeployTask.getInfo = function () {
        return {
            title: 'Deploy unit set',
            description: 'Deploys version for each unit in set'
        };
    };

    return DeployTask;
});
