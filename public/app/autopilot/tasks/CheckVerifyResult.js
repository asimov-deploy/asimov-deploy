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
    "../task-aborted-exception"
],
function(_, when, TaskAbortedException) {
    var CheckVerifyResultTask = function (config, eventAggregator) {
        var _checkVerifyResult = function(agents, units) {
            var deferred = when.defer();

            var dispose = function () {
                eventAggregator.off('agent:event:verify-progress', verifyProgress);
                eventAggregator.off('autopilot:continue-deploy', continueDeploy);
                eventAggregator.off('autopilot:abort-deploy', abort);
            };

            var failedTests = 0;
            var completedAgentUnits = 0;

            var verifyProgress = function (data) {
                if (_.contains(agents, data.agentName) &&
                    _.contains(_.pluck(units, 'unitName'), data.unitName) &&
                    data.test) {
                    failedTests += !data.test.pass ? 1 : 0;
                }

                if (_.contains(agents, data.agentName) &&
                    _.contains(_.pluck(units, 'unitName'), data.unitName) &&
                    data.completed) {
                    completedAgentUnits++;
                }

                if (agents.length * units.length === completedAgentUnits) {
                    if (failedTests > 0) {
                        eventAggregator.trigger('autopilot:pause-deploy');
                    }
                    else {
                        dispose();
                        deferred.resolve();
                    }
                }
            };

            var continueDeploy = function () {
                dispose();
                deferred.resolve();
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
                return when(_checkVerifyResult(task.agents, task.units));
            };
        };
    };

    CheckVerifyResultTask.getInfo = function () {
        return {
            title: 'Check verify result',
            description: 'Checks result from verify and prompts user if there are failed steps'
        };
    };

    return CheckVerifyResultTask;
});
