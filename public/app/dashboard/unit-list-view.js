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
		"marionette",
		"./unit-instance-list-view",
		"./deploy-lifecycle-view",
		"./../app",
		"backbone",
		"jquery.cookie"
	],
	function($, Marionette, UnitInstanceListView, DeployLifecycle, app, Backbone) {

		var DeployLifecycleStartCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/start"
		});

		var DeployLifecycleCompleteCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/complete"
		});

		var DeployLifecycleCancelCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/cancel"
		});

		return Marionette.CompositeView.extend({
			itemView: UnitInstanceListView,
			itemViewContainer: "table",

			template: "dashboard/unit-list-view",

			events: {
				"click .btn-refresh": "refresh",
				"change .search-query": "filterUpdated",
				"click .btn-start-deploy": "startDeploy",
				"click .btn-finish-deploy": "finishDeploy",
				"click .btn-cancel-deploy": "cancelDeploy",
				"click .btn-configure-autopilot": "configureAutopilot"
			},

			initialize: function(options) {
				this.unfiltered = options.collection;
				this.collection = new this.collection.constructor(this.collection.models, this.collection.options);
				this.listenTo(this.unfiltered, "reset", this.applyFilter, this);
				this.loadFilterText();
				this.initDeployMode();

				if (this.collection.length > 0) {
					this.applyFilter();
				}

				app.vent.on('autopilot:deploy-started', function () {
					this.render();
				}, this);

				app.vent.on('autopilot:deploy-ended', function () {
					this.render();
				}, this);

				app.vent.on('deploy:started', function(){
					this.hasActiveDeploy = true;
				},this);

				app.vent.on('deploy:finished', function(){
					this.hasActiveDeploy = false;
				},this);

				app.vent.on('deploy:canceled', function(){
					this.hasActiveDeploy = false;
				},this);

				app.reqres.setHandler("deploy:get-status", function(){
					if(this.deployAnnotationsEnabled === false){
						return {
							isDeploying: true
						};
					}
					return {
						isDeploying: this.hasActiveDeploy
					};
				},this);

				app.vent.on('deploy:start-requested', function(){
					this.startDeploy();
				},this);
			},

			initDeployMode: function() {
				var featureToggles = app.initData.featureToggles;
				var annotationConfig = featureToggles.deployAnnotations;
				if (!featureToggles || !annotationConfig) {
					this.deployAnnotationsEnabled = false;
					return;
				}

				this.deployAnnotations = annotationConfig.enabled === true;

				var deployIdCookie = $.cookie(annotationConfig.deployIdCookie);
				this.hasActiveDeploy = deployIdCookie !== undefined;
			},

			startDeploy: function() {
				var dlc = new DeployLifecycle();
				dlc.on('submit', this.deployStarted, this);
				dlc.show();
			},

			deployStarted: function(data) {
				this.toggleDeployButtons(true);
				var command = new DeployLifecycleStartCommand();
				command.set(data);
				command.save();
				app.vent.trigger('deploy:started');
			},

			finishDeploy: function() {
				this.toggleDeployButtons(false);
				new DeployLifecycleCompleteCommand().save();
				app.vent.trigger('deploy:finished');
			},

			cancelDeploy: function() {
				this.toggleDeployButtons(false);
				new DeployLifecycleCancelCommand().save();
				app.vent.trigger('deploy:canceled');
			},

			configureAutopilot: function() {
				app.vent.trigger("autopilot:configure");
			},

			toggleDeployButtons: function(hasActiveDeploy) {
				this.hasActiveDeploy = hasActiveDeploy;
				this.render();
			},

			refresh: function(e) {
				$(e.target).button("loading");

				this.unfiltered.fetch()
					.always(function() {
						$(e.target).button("reset");
					});
			},

			applyFilter: function() {

				var regEx = new RegExp(this.filterText, 'i');

				this.collection.reset(this.unfiltered.filter(function(item) {
					return regEx.exec(item.get('name')) !== null;
				}));
			},

			filterUpdated: function(e) {
				this.filterText = $(e.target).val();
				this.saveLoadFilterText();
				this.applyFilter();
			},

			serializeData: function() {
				return {
					filterText: this.filterText,
					hasActiveDeploy: this.hasActiveDeploy,
					deployAnnotationsEnabled: this.deployAnnotations,
					autopilot: {
						enabled: app.autopilot.enabled,
						started: app.autopilot.started
					}
				};
			},

			saveLoadFilterText: function() {
				if (localStorage) {
					localStorage.setItem('DeployUnitView:filter', this.filterText);
				}
			},

			loadFilterText: function() {
				this.filterText = "";

				if (localStorage) {
					var storedFilter = localStorage.getItem('DeployUnitView:filter');
					if (storedFilter) {
						this.filterText = storedFilter;
					}
				}

			}

		});

	});