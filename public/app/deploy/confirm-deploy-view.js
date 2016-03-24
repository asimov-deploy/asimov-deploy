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
	"../collections/agent-query-collection"
],
function($, _, Backbone, Marionette, AgentQueryCollection) {

	var DeployCommand = Backbone.Model.extend({
		url: "/deploy/deploy"
	});

	return Marionette.ItemView.extend({
		el: $("#asimov-modal"),
		template: "dashboard/confirm-deploy-view",
		events: {
			"click .btn-close": "close",
			"click .btn-deploy": "deploy"
		},

		initialize: function(options) {
			_.bindAll(this, "show");

			this.createModel(options);

			this.parameters = new AgentQueryCollection({
				agentUrl: "/units/deploy-parameters/:unitName",
				agentName: this.anyAgentName,
				unitName: this.unitName
			});

			this.parameters.on("add", this.parametersLoaded, this);
			this.model.on("change", this.render, this);
		},

		createModel: function(options) {
			this.unitName = options.unitName;
			this.anyAgentName = options.agentNames[0];
			this.hasDeployParameters = options.hasDeployParameters;
			this.deployInfo = options.deployInfo;
			this.agentNames = options.agentNames;

			this.model = new Backbone.Model({
				unitName: this.unitName,
				version: this.deployInfo.version,
				branch: this.deployInfo.branch,
				agents: this.agentNames
			});
		},

		show: function() {
			if (this.hasDeployParameters) {
				this.parameters.fetch();
			}

			this.render();
			$(".modal").modal("show");
		},

		parametersLoaded: function() {
			this.model.set({parameters: this.parameters.toJSON()});
		},

		close: function() {
			$(".modal").modal("hide");
			this.undelegateEvents();
		},

		deploy: function() {

			var parameterValues = {};
			this.parameters.forEach(function(param) {
				var paramName = param.get('name');
				parameterValues[paramName] = $("#deploy-param-" + paramName).val();
			});

			_.forEach(this.agentNames, function(agentName) {
				this.deployUnitInstance(agentName, parameterValues);
			}, this);

			this.close();
		},

		deployUnitInstance: function(agentName, parameterValues) {
			new DeployCommand({
				agentName: agentName,
				unitName: this.unitName,
				versionId: this.deployInfo.versionId,
				parameters: parameterValues
			}).save();
		}

	});

});