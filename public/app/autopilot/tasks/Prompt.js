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
    "when",
    "app",
    "../task-aborted-exception"
],
function(when, app, TaskAbortedException) {
    var prompt = function() {
        var deferred = when.defer();

        var dispose = function () {
            app.vent.off('autopilot:continue-deploy', continueDeploy);
            app.vent.off('autopilot:abort-deploy', abort);
        };

        var continueDeploy = function () {
            dispose();
            deferred.resolve();
        };

        var abort = function () {
            dispose();
            deferred.reject(new TaskAbortedException());
        };

        app.vent.on('autopilot:continue-deploy', continueDeploy);
        app.vent.on('autopilot:abort-deploy', abort);

        if (!app.autopilot.paused) {
            app.vent.trigger('autopilot:pause-deploy');
        }

        return deferred.promise;
    };

    return {
        execute: function () {
            return function () {
                return when(prompt());
            };
        },

        getInfo: function () {
            return {
                title: 'Prompt',
                description: 'Pause execution and waits for user input'
            };
        }
    };
});