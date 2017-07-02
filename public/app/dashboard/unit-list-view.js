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
		"jquery",
		"marionette",
		"./unit-instance-list-view",
		"./deploy-lifecycle-view",
		"../deploys/ensure-active-deploy",
		"./../app",
		"backbone",
		"jquery.cookie",
		"select2"
	],
	function(_, $, Marionette, UnitInstanceListView, DeployLifecycle, ensureActiveDeploy, app, Backbone) {

		var DeployLifecycleStartCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/start"
		});

		var DeployLifecycleCompleteCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/complete"
		});

		var DeployLifecycleCancelCommand = Backbone.Model.extend({
			url: "/deploy-lifecycle/cancel"
		});

		var _openDropDown = function () {
			this.$el.find("#deploy-unit-filter").select2("open");
		};

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
				this.initialFilters = options.filters || {};

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

				app.vent.on('deploy:start-canceled',function(){
					this.initDeployOptOut = true;
					if(this.startDeployCallback){
						this.startDeployCallback();
						this.startDeployCallback = null;
					}
				},this);

				app.vent.on('deploy:started', function(){
					this.hasActiveDeploy = true;
					this.initDeployOptOut = false;
					if(this.startDeployCallback){
						this.startDeployCallback();
						this.startDeployCallback = null;
					}
				},this);

				app.vent.on('deploy:finished', function(){
					this.initDeployOptOut = false;
					this.hasActiveDeploy = false;
				},this);

				app.vent.on('deploy:canceled', function(){
					this.hasActiveDeploy = false;
				},this);

				app.commands.setHandler('deploy:start-with-callback', function(args){
					if(this.deployAnnotationsEnabled === false){
						args.callback();
					}
					else if(this.hasActiveDeploy){
						args.callback();
					}
					else if(this.initDeployOptOut === true){
						args.callback();
					}
					else {
						this.startDeployCallback = args.callback;
						this.startDeploy();
					}
				},this);
			},

			onClose: function() {
				this.$el.find("#deploy-unit-filter").select2("destroy");
				app.vent.off('keyboard:ctrl:f', _openDropDown, this);
			},

			onRender: function() {
				var initialData = [];
				_.each(Object.keys(this.initialFilters), function (group) {
					_.each(this.initialFilters[group], function (f) {
						f.group = group;
						f.selected = true;
						initialData.push(f);
					});
				}, this);

				this.$el.find("#deploy-unit-filter").select2({
					placeholder: "Filter deploy units...",
					templateSelection: function (data) {
						return data.selectionText;
					},
					allowClear: true,
					data: initialData,
					ajax: {
						url: "/units/auto-complete",
						dataType: 'json',
						delay: 100,
						data: function (params) {
							return {
								q: params.term
							};
						},
						processResults: function (data) {
							return {
								results: data
							};
						}
					}
				})
				.on("select2:select", function (e) {
					this.trigger('filter-selection:added', {
						group: e.params.data.group,
						id: e.params.data.id,
						text: e.params.data.text,
						selectionText: e.params.data.selectionText
					});
				}.bind(this))
				.on("select2:unselect", function(e) {
					this.trigger('filter-selection:removed', {
						group: e.params.data.group,
						id: e.params.data.id,
						text: e.params.data.text,
						selectionText: e.params.data.selectionText
					});
				}.bind(this));

				// Hack to get the placeholder to show up on load
				this.$el.find('.select2-search__field').css('width', 'auto');

				app.vent.on('keyboard:ctrl:f', _openDropDown, this);
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
				this.initDeployOptOut = false;
			},

			startDeploy: function() {
				var dlc = new DeployLifecycle();
				dlc.on('submit', this.deployStarted, this);
				dlc.on('close', this.deployStartCanceled, this);
				dlc.show();
			},

			deployStartCanceled: function(){
				app.vent.trigger('deploy:start-canceled');
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

			configureAutopilot: ensureActiveDeploy(function() {
				app.vent.trigger("autopilot:configure");
			}),

			toggleDeployButtons: function(hasActiveDeploy) {
				this.hasActiveDeploy = hasActiveDeploy;
				this.render();
			},

			refresh: function () {
				this.trigger('refresh');
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