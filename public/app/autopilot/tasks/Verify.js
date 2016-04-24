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
    "../task-aborted-exception"
],
function(_, when, sequence, Backbone, TaskAbortedException) {
    var VerifyTask = function (config, eventAggregator) {
        var VerifyCommand = Backbone.Model.extend({
            defaults: {
                'actionName': 'Verify'
            },
            url: "/agent/action"
        });

        var _createVerifyUnitOnAgentsTask = function (agents, unit, skipInitialVerifyStep) {
            return function() {
                var deferreds = [];

                _.each(agents, function (agentName) {
                    deferreds.push(_verifyUnitOnAgent(skipInitialVerifyStep, agentName, unit.unitName));
                });

                return when.all(deferreds).delay(config.verifyPostDelay);
            };
        };

        var _verifyUnitOnAgent = function(skipInitialVerifyStep, agentName, unitName) {
            var deferred = when.defer();

            if (!skipInitialVerifyStep) {
                new VerifyCommand({
                    agentName: agentName,
                    unitName: unitName
                }).save();
            }

            var dispose = function () {
                eventAggregator.off('agent:event:verify-progress', verifyProgress);
                eventAggregator.off('autopilot:continue-deploy', continueDeploy);
                eventAggregator.off('autopilot:abort-deploy', abort);
            };

            var failedTests = 0;
            var retries = 0;

            var verifyProgress = function (data) {
                if (data.agentName === agentName &&
                    data.unitName === unitName &&
                    data.test) {
                    failedTests += !data.test.pass ? 1 : 0;
                }

                if (data.agentName === agentName &&
                    data.unitName === unitName &&
                    data.completed) {
                    if (failedTests === 0) {
                        dispose();
                        deferred.resolve();
                    }
                    else if (config.verifyRetryOnFailure && retries < config.verifyFailureRetries) {
                        failedTests = 0;
                        retries++;
                        new VerifyCommand({
                            agentName: agentName,
                            unitName: unitName
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
                    unitName: unitName
                });
            };

            var abort = function () {
                dispose();
                deferred.reject(new TaskAbortedException());
            };

            eventAggregator.on('agent:event:verify-progress', verifyProgress);
            eventAggregator.on('autopilot:continue-deploy', continueDeploy);
            eventAggregator.on('autopilot:abort-deploy', abort);

            return deferred.promise;
        };

        this.execute = function (task) {
            return function() {
                var tasks = [];

                _.each(task.units, function (unit) {
                    tasks.push(_createVerifyUnitOnAgentsTask(task.agents, unit, false));
                });

                return sequence(tasks);
            };
        };

        this.executeAndSkipInitialVerifyStep = function (task) {
            return function() {
                var tasks = [];

                _.each(task.units, function (unit) {
                    tasks.push(_createVerifyUnitOnAgentsTask(task.agents, unit, true));
                });

                return sequence(tasks);
            };
        };
    };

    VerifyTask.getInfo = function () {
        return {
            title: 'Verify',
            description: 'Verify each unit in set and check result from verify and prompt user if there are failed steps'
        };
    };

    return VerifyTask;
});
