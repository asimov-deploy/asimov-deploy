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
    "backbone",
    "./confirm-deploy-view",
    "./verify-log-view",
    "./version-dialog-view",
    "./deploy-log-dialog-view"
],
function($, Backbone, ConfirmDeployView, VerifyLogView, VersionDialogView, DeployLogDialogView) {

	var AgentActionCommand = Backbone.Model.extend({
        url: "/agent/action"
    });

	return Backbone.Marionette.ItemView.extend({
        template: "dashboard/unit-instance-view",
        tagName: "tr",
        className: "deploy-unit-instance",
        events: {
            "click .verify-log-link": "verifyLog",
            "click .select-version": "selectVersion",
            "click .deploy-log-link": "openDeployLog",
            "click .btn-unit-action": "unitAction",
            "click .btn-select": "toggleSelection"
        },

        initialize: function() {
            _.bindAll(this);

            this.model.on("change", this.render, this);
        },

        verifyLog: function(e) {
            e.preventDefault();
            new VerifyLogView({model: this.model}).show();
        },

        selectVersion: function(e) {
            e.preventDefault();
        },

        openDeployLog: function(e) {
            e.preventDefault();

            var deployLog = new DeployLogDialogView({ agentName: this.model.get('agentName'), unitName: this.model.get('unitName') });
            deployLog.show();
        },

        unitAction: function(e) {
            e.preventDefault();

            var actionName = $(e.currentTarget).data("action-name");

            new AgentActionCommand({
                agentName: this.model.get("agentName"),
                unitName: this.model.get("unitName"),
                actionName: actionName
            }).save();
        },

        toggleSelection: function(e) {
            var selected = this.model.get('selected') || false;
            this.model.set({ selected: !selected });
        }

    });
});