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
    var VerifyCommand = Backbone.Model.extend({
        defaults: {
            'actionName': 'Verify'
        },
        url: "/agent/action"
    });

    var createVerifyUnitOnAgentsTask = function (agents, unit) {
        return function() {
            var deferreds = [];

            _.each(agents, function (agentName) {
                deferreds.push(verifyUnitOnAgent(agentName, unit.unitName));
            });

            return when.all(deferreds).delay(1000);
        };
    };

    var verifyUnitOnAgent = function(agentName, unitName) {
        var deferred = when.defer();

        new VerifyCommand({
            agentName: agentName,
            unitName: unitName
        }).save();

        var dispose = function () {
            app.vent.off('agent:event:verify-progress', verifyProgress);
            app.vent.off('autopilot:abort-deploy', abort);
        };

        var verifyProgress = function (data) {
            if (data.agentName === agentName &&
                data.unitName === unitName &&
                data.completed) {
                dispose();
                deferred.resolve({
                    agentName: agentName,
                    unitName: unitName
                });
            }
        };

        var abort = function () {
            dispose();
            deferred.reject(new TaskAbortedException());
        };

        app.vent.on('agent:event:verify-progress', verifyProgress);
        app.vent.on('autopilot:abort-deploy', abort);

        return deferred.promise;
    };

    return {
        execute: function (task) {
            var tasks = [];

            _.each(task.units, function (unit) {
                tasks.push(createVerifyUnitOnAgentsTask(task.agents, unit));
            });

            return sequence(tasks);
        },

        getInfo: function () {
            return {
                title: 'Verify',
                description: 'Execute the action Verify for each unit in set'
            };
        }
    };
});