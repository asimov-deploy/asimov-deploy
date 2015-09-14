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
    var DisableLoadBalancerCommand = Backbone.Model.extend({
        defaults: {
            'action': 'disable'
        },
        url: "/loadbalancer/change"
    });

    var createDisableLoadBalancerForAgentsTask = function (agents) {
        return function() {
            var deferreds = [];

            _.each(agents, function (agentName) {
                deferreds.push(disableLoadBalancerForAgent(agentName));
            });

            return when.all(deferreds);
        };
    };

    var disableLoadBalancerForAgent = function(agentName) {
        var deferred = when.defer();

        new DisableLoadBalancerCommand({
            agentName: agentName
        }).save();

        var timeout = setTimeout(function() {
            dispose();
            deferred.reject({
                agentName: agentName,
                reason: 'timeout'
            });
        }, 10000);

        var dispose = function () {
            app.vent.off("agent:event:loadBalancerStateChanged", loadBalancerStateChanged);
            app.vent.off('autopilot:abort-deploy', abort);
            clearTimeout(timeout);
        };

        var loadBalancerStateChanged = function (data) {
            if (data.agentName === agentName &&
                data.state.enabled === false &&
                data.state.connectionCount === 0) {
                dispose();
                deferred.resolve(agentName);
            }
        };

        var abort = function () {
            dispose();
            deferred.reject(new TaskAbortedException());
        };

        app.vent.on("agent:event:loadBalancerStateChanged", loadBalancerStateChanged);
        app.vent.on('autopilot:abort-deploy', abort);

        return deferred.promise;
    };

    return {
        execute: function (task) {
            return function() {
                var tasks = [];
                tasks.push(createDisableLoadBalancerForAgentsTask(task.agents));

                return sequence(tasks);
            };
        },

        getInfo: function () {
            return {
                title: 'Disable load balancer for agents',
                description: 'Takes agents out of load'
            };
        }
    };
});
