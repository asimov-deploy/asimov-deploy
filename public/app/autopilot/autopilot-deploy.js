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
    "jquery",
    "underscore",
    "app",
    "backbone",
    "./autopilot-deploy-manager",
    "./task-aborted-exception"
],
function($, _, app, Backbone, DeployManager, TaskAbortedException) {
    app.vent.on('autopilot:start-deploy', function (configuration) {
        app.vent.trigger('autopilot:deploy-started');

        var deployManager = new DeployManager(configuration);
        deployManager
            .deploy()
            .then(
                function () {
                    app.vent.trigger('autopilot:deploy-completed');
                })
            .otherwise(function (e) { return e instanceof TaskAbortedException; }, function (e) {
                console.error('deploy aborted', e);
                app.vent.trigger('autopilot:deploy-aborted');
            })
            .otherwise(function (e) {
                console.error('deploy failed', e);
                app.vent.trigger('autopilot:deploy-failed', e);
            });
    });

    return {};
});