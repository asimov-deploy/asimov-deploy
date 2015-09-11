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
    "backbone",
    "app",
    "./autopilot-control-view",
    "./deployable-unit-set-dialog-view",
    "./configuration-dialog-view",
    "./confirm-dialog-view",
    "./autopilot-deploy",
    "dashboard/version-dialog-view",
    "./tasks/tasks"
],
function(_, Backbone, app, ControlView, DeployableUnitSetDialogView, ConfigurationDialogView, ConfirmDialogView, AutopilotDeploy, VersionDialogView, tasks) {
    var autopilot = {
        Models: {},
        Collections: {},
        enabled: false,
        started: false,
        paused: false
    };

    var DeployableUnitSet = Backbone.Model.extend({
        idAttribute: "id"
    });

    var DeployableUnitSetCollection = Backbone.Collection.extend({
        model: DeployableUnitSet,
        url: '/auto-deploy/deployable-unit-sets'
    });

    autopilot.Models.DeployableUnit = Backbone.Model.extend({
        idAttribute: "unitName"
    });

    autopilot.Collections.DeployableUnitCollection = Backbone.Collection.extend({
        model: autopilot.Models.DeployableUnit,

        initialize: function(options) {
            this.deployableUnitSetId = options.deployableUnitSetId;
        },

        url: function() {
            return '/auto-deploy/deployable-unit-sets/:id/units'.replace(":id", encodeURIComponent(this.deployableUnitSetId));
        }
    });

    var configurationDialogView = null;
    var changeVersionForUnitName = null;

    app.on('initialize:before', function() {
        var featureToggles = app.initData.featureToggles;

        if (!featureToggles || !featureToggles.autopilot) {
            autopilot.enabled = false;
            return;
        }

        autopilot.enabled = featureToggles.autopilot.enabled === true;
    });

    app.vent.on("autopilot:configure", function() {
        if (!autopilot.deployableUnitSets) {
            autopilot.deployableUnitSets = new DeployableUnitSetCollection();
            autopilot.deployableUnitSets.fetch();
        }

        var deployableUnitSetDialogView = new DeployableUnitSetDialogView({ collection: autopilot.deployableUnitSets });
        deployableUnitSetDialogView.on('deployableUnitSetSelected', deployableUnitSetSelected, this);
        deployableUnitSetDialogView.show();
    });

    app.vent.on('autopilot:deploy-started', function() {
        app.autopilot.started = true;

        var controlView = new ControlView();
        controlView.show();
    });

    app.vent.on('autopilot:pause-deploy', function() {
        app.autopilot.paused = true;
    });

    app.vent.on('autopilot:continue-deploy', function() {
        app.autopilot.paused = false;
    });

    var deployEnded = function() {
        app.autopilot.started = false;
        app.autopilot.paused = false;
        app.vent.trigger('autopilot:deploy-ended');
    };

    app.vent.on('autopilot:deploy-completed', deployEnded);
    app.vent.on('autopilot:deploy-aborted', deployEnded);
    app.vent.on('autopilot:deploy-failed', deployEnded);

    var deployableUnitSetSelected = function (deployableUnitSetId) {
        autopilot.selectedDeployableUnitSet = autopilot.deployableUnitSets.get(deployableUnitSetId);

        autopilot.deployableUnits = new autopilot.Collections.DeployableUnitCollection({
            deployableUnitSetId: autopilot.selectedDeployableUnitSet.get('id')
        });
        autopilot.deployableUnits.fetch();

        showConfigurationDialog();
    };

    var changeVersion = function (payload) {
        changeVersionForUnitName = payload.unitName;
        configurationDialogView.close();

        var versionView = new VersionDialogView(payload);
        versionView.on("versionSelected", versionSelected, this);
        versionView.on("closed", versionSelectionClosed, this);
        versionView.show();
    };

    var versionSelected = function (id, version, branch) {
        var model = autopilot.deployableUnits.get(changeVersionForUnitName);
        var selectedVersion = model.get('selectedVersion');
        selectedVersion.id = id;
        selectedVersion.version = version;
        selectedVersion.branch = branch;
        model.set('selectedVersion', selectedVersion);

        configurationDialogView.close();
        showConfigurationDialog();
    };

    var versionSelectionClosed = function () {
        showConfigurationDialog();
    };

    var showConfigurationDialog = function () {
        configurationDialogView = new ConfigurationDialogView({
            model: autopilot.selectedDeployableUnitSet,
            collection: autopilot.deployableUnits
        });

        configurationDialogView.on('changeVersion', changeVersion, this);
        configurationDialogView.on('submit', configurationStepCompleted, this);
        configurationDialogView.show();
    };

    var configurationStepCompleted = function (payload) {
        var deployableUnitSet = autopilot.selectedDeployableUnitSet.toJSON();
        var verificationSteps = _.map(deployableUnitSet.verificationSteps, function (taskName) {
            return tasks.getTaskInformation(taskName);
        });

        var steps = _.map(deployableUnitSet.steps, function (taskName) {
            return tasks.getTaskInformation(taskName);
        });

        var autopilotConfiguration = new Backbone.Model({
            deployableUnitSet: autopilot.selectedDeployableUnitSet.toJSON(),
            deployableUnits: autopilot.deployableUnits.toJSON(),
            deployToMaximumAgentsSimultaneously: payload.deployToMaximumAgentsSimultaneously,
            verificationIterationCount: payload.verificationIterationCount,
            verificationSteps: verificationSteps,
            steps: steps
        });

        var deployableUnits = autopilot.deployableUnits.toJSON();

        if (deployableUnits.length > 1) {
            var deployableUnitsOfInstances = _.pluck(deployableUnits, 'instances');

            if (!allArraysAlike(deployableUnitsOfInstances)) {
                console.log('The number of instances between deployable units must be the same!');
                return;
            }
        }

        configurationDialogView.close();

        var confirmDialogView = new ConfirmDialogView({
            model: autopilotConfiguration
        });
        confirmDialogView.on('deploy', function(autopilotConfiguration) {
            app.vent.trigger('autopilot:start-deploy', autopilotConfiguration.toJSON());
        });
        confirmDialogView.show();
    };

    var allArraysAlike = function (arrays) {
        return _.all(arrays, function(array) {
            return array.length === arrays[0].length && _.difference(array, arrays[0]).length === 0;
        });
    };

    app.autopilot = autopilot;

    return {};
});