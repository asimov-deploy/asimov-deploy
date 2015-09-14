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
    "app",
    "../task-aborted-exception"
],
function(_, when, sequence, app, TaskAbortedException) {
    var checkVerifyResult = function(agents, units) {
        var deferred = when.defer();

        var dispose = function () {
            app.vent.off('agent:event:verify-progress', verifyProgress);
            app.vent.off('autopilot:continue-deploy', continueDeploy);
            app.vent.off('autopilot:abort-deploy', abort);
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
                    app.vent.trigger('autopilot:pause-deploy');
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

        app.vent.on('agent:event:verify-progress', verifyProgress);
        app.vent.on('autopilot:continue-deploy', continueDeploy);
        app.vent.on('autopilot:abort-deploy', abort);

        return deferred.promise;
    };

    return {
        execute: function (task) {
            return function() {
                return when(checkVerifyResult(task.agents, task.units));
            };
        },

        getInfo: function () {
            return {
                title: 'Check verify result',
                description: 'Checks result from verify and prompts user if there are failed steps'
            };
        }
    };
});
