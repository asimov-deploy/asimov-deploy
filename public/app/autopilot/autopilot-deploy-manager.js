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

/* jshint -W083 */
/* jshint -W072 */
/* jshint -W074 */

define([
    "jquery",
    "underscore",
    "backbone",
    "when",
    "when/sequence",
    "app",
    "./tasks/tasks"
],
function($, _, Backbone, when, sequence, app, tasks) {
    var DeployManager = function(configuration) {
        var instances = configuration.deployableUnits[0].instances;
        var deployToMaximumAgentsSimultaneously = configuration.deployToMaximumAgentsSimultaneously;
        var verificationIterationCount = configuration.verificationIterationCount;
        var deployRoundCount = Math.ceil(instances.length / deployToMaximumAgentsSimultaneously);

        var completedIterations = 0;
        var completedAgents = 0;
        this.deployIterations = [];

        while (completedIterations < deployRoundCount) {
            this.deployIterations[completedIterations] = [];
            var oldCompletedAgents = completedAgents;
            var agents = [];

            for (var n = oldCompletedAgents; n < (oldCompletedAgents + deployToMaximumAgentsSimultaneously) && n < instances.length; n++) {
                agents.push(instances[n]);
                completedAgents++;
            }

            var units = _.map(configuration.deployableUnits, function (deployableUnit) {
                return {
                    unitName: deployableUnit.unitName,
                    versionId: deployableUnit.selectedVersion.id
                };
            });

            var deployIteration = {
                sequence: completedIterations,
                steps: []
            };

            var stepSequence = 0;

            if (verificationIterationCount > completedIterations) {
                _.each(configuration.deployableUnitSet.verificationSteps, function (stepName) {
                    deployIteration.steps.push({
                        sequence: stepSequence,
                        name: stepName,
                        agents: agents,
                        units: units
                    });
                    stepSequence++;
                });
            }
            else {
                _.each(configuration.deployableUnitSet.steps, function (stepName) {
                    deployIteration.steps.push({
                        sequence: stepSequence,
                        name: stepName,
                        agents: agents,
                        units: units
                    });
                    stepSequence++;
                });
            }


            this.deployIterations[completedIterations] = deployIteration;

            completedIterations++;
        }


        var _createDeployRoundTask = function (deployIteration) {
            return function() {
                var deployIterationStepTasks = [];

                _.each(deployIteration.steps, function (step) {
                    deployIterationStepTasks.push(tasks.createTask(app.autopilot, step));
                });

                return sequence(deployIterationStepTasks);
            };
        };
        
        this._executeDeploy = function () {
            var deployIterationTasks = [];

            _.each(this.deployIterations, function (round) {
                deployIterationTasks.push(_createDeployRoundTask(round));
            });

            return sequence(deployIterationTasks);
        };
    };

    DeployManager.prototype = {
        deploy: function () {
            return this._executeDeploy();
        }
    };

    return DeployManager;
});
