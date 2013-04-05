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
    "app",
    "./deploy-unit-list-view",
    "./deploy-unit-collection"
],
function(_, app, DeployUnitListView, DeployUnitCollection) {

    var deployUnitList = new DeployUnitCollection();
    var dashboard = {};

    // events
    app.vent.on("agent:event:deployStarted", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        unit.deployStarted(data);
    });

    app.vent.on("agent:event:deployFailed", function(data) {
       var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
       unit.deployFailed(data);
    });

    app.vent.on("agent:event:deployCompleted", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        unit.deployCompleted(data);
    });

    app.vent.on("agent:event:loadBalancerStateChanged", function(data) {
        deployUnitList.forEach(function(unit) {
            if (unit.get('loadBalancerId') === data.id) {
                unit.set({ loadBalancerEnabled: data.enabled });
            }
        });
    });

    app.vent.on("agent:event:verify-progress", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        var info = unit.get("info");
        var steps = info.steps ? info.steps.slice(0) : [];

        steps.push({ pass: data.pass, completed: data.completed, message: data.message });

        if (data.started) {
            steps = [];
        }

        var update = {
            info: {
                verifying: true,
                steps: steps
            },
            verified: data.completed && data.pass
        };

        unit.set(update);
    });

    app.vent.on("dashboard:show", function(filter) {

        var view = new DeployUnitListView({ collection: deployUnitList });
        app.mainRegion.show(view);

        if (deployUnitList.length === 0) {
            deployUnitList.fetch();
        }

        app.router.showRoute("dashboard");
    });

    return dashboard;

});