define([
    "jquery",
    "underscore",
    "marionette",
    "../collections/agent-query-collection"
],
function($, _, Marionette, AgentQueryCollection) {

    var DeployCommand = Backbone.Model.extend({
        url: "/deploy/deploy"
    });

	return Marionette.ItemView.extend({
        el: $("#asimov-modal"),
        template: "confirm-deploy",
        events: {
            "click .btn-close": "close",
            "click .btn-deploy": "deploy"
        },

        initialize: function(options) {
            _.bindAll(this, "show");

            this.deployUnit = options.deployUnit;

            this.model = new Backbone.Model({
                agentName: this.deployUnit.get("agentName"),
                unitName: this.deployUnit.get("unitName"),
                versionId: this.deployUnit.get("versionId"),
                version: this.deployUnit.get("version")
            });

            this.parameters = new AgentQueryCollection({
                agentUrl: "/units/deploy-parameters/:unitName",
                agentName: this.deployUnit.get("agentName"),
                unitName: this.deployUnit.get("unitName")
            });

            this.parameters.on("reset", this.parametersLoaded, this);
            this.model.on("change", this.render, this);
        },

        show: function() {
            if (this.deployUnit.get("hasDeployParameters")) {
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

            new DeployCommand({
                agentName: this.model.get("agentName"),
                unitName: this.model.get("unitName"),
                versionId: this.model.get("versionId"),
                parameters: parameterValues
            }).save();

            this.close();
        }

    });

});