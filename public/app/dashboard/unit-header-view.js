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
    "backbone",
    "marionette",
    "./../app",
    "./version-dialog-view",
    "../deploys/confirm-deploy-view",
    "../deploys/ensure-active-deploy"
],
    function ($, _, Backbone, Marionette, app, VersionDialogView, ConfirmDeployView, ensureActiveDeploy) {

        var AgentActionCommand = Backbone.Model.extend({
            url: "/agent/action"
        });

        var ChangeLoadBalancerStatusCommand = Backbone.Model.extend({
            url: "/loadbalancer/change"
        });

        return Marionette.ItemView.extend({
            template: "dashboard/unit-header-view",
            events: {
                "click .btn-select": "toggleSelectAll",
                "click .btn-select-version": "selectVersion",
                "click .btn-unit-action": "unitAction",
                "click .btn-set-loadbalancer-in": "setLoadBalancerIn",
                "click .btn-set-loadbalancer-out": "setLoadBalancerOut"
            },

            initialize: function (options) {
                this.instances = options.instances;

                this.listenTo(this.instances, "change:selected", this.selectionChanged, this);
                this.listenTo(this.model, "change", this.render, this);

                this.selectionChanged();
            },

            selectionChanged: function () {
                var selectedInstances = this.instances.where({ selected: true });
                var anySelected = selectedInstances.length > 0;
                var allSelected = selectedInstances.length === this.instances.length;
                var showLoadBalancerToggle = this.instances.some(function (instance) {
                    return instance.get('loadBalancerState') ? true : false;
                });
                var group = this.instances.at(0).get('group');
                var type = this.instances.at(0).get('type');

                this.model.set({
                    group: group,
                    type: type,
                    showActions: anySelected,
                    allSelected: allSelected,
                    showLoadBalancerToggle: showLoadBalancerToggle
                });
            },

            toggleSelectAll: function (evt) {
                var selectedInstances = this.instances.where({ selected: true });
                var allSelected = selectedInstances.length === this.instances.length;

                if (evt.ctrlKey) {
                    this.instances.forEach(function (instance) {
                        instance.set({ selected: !instance.changed.selected });
                    });
                    return;
                }
                if (evt.shiftKey) {
                    var mid = this.instances.length / 2;
                    var count = 0;
                    this.instances.forEach(function (instance) {
                        var first = count < mid;
                        instance.set({ selected: first });
                        count++;
                    });
                    return;
                }
                this.instances.forEach(function (instance) {
                    instance.set({ selected: !allSelected });
                });
            },

            selectVersion: ensureActiveDeploy(function () {
                var instance = this.instances.first();
                var versionView = new VersionDialogView({ agentName: instance.get('agentName'), unitName: instance.get('unitName') });
                versionView.on("versionSelected", this.versionSelected, this);
                versionView.show();
            }),

            versionSelected: function (versionId, version, branch) {
                var selectedInstances = this.instances.where({ selected: true });
                var agentNames = _.map(selectedInstances, function (unit) { return unit.get('agentName'); });
                var hasDeployParameters = selectedInstances[0].get('hasDeployParameters');

                var confirmView = new ConfirmDeployView({
                    unitName: this.model.get('name'),
                    agentNames: agentNames,
                    hasDeployParameters: hasDeployParameters,
                    deployInfo: {
                        version: version,
                        versionId: versionId,
                        branch: branch
                    }
                });

                confirmView.show();
            },

            unitAction: ensureActiveDeploy(function (e) {
                e.preventDefault();

                var selectedInstances = this.instances.where({ selected: true });
                var actionName = $(e.currentTarget).data("action-name");

                if (actionName === "Stop" && !confirm("Are you sure you want to stop selected deploy units?")) {
                    return;
                }

                _.forEach(selectedInstances, function (instance) {
                    new AgentActionCommand({
                        agentName: instance.get("agentName"),
                        unitName: instance.get("unitName"),
                        actionName: actionName
                    }).save();
                });
            }),

            setLoadBalancerIn: function () {
                this.setLoadBalancer(true);
            },

            setLoadBalancerOut: function () {
                this.setLoadBalancer(false);
            },

            setLoadBalancer: function (enable) {
                var selectedInstances = this.instances.where({ selected: true });
                _.each(selectedInstances, function (instance) {
                    instance.set({ showAsChanging: true });
                    new ChangeLoadBalancerStatusCommand({
                        agentName: instance.get('agentName'),
                        action: enable ? "enable" : "disable"
                    }).save();
                });
            }
        });
    });
