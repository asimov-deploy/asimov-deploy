define([
	"jquery",
	"underscore",
	"backbone",
	"marionette",
	"app",
    "../collections/agent-query-collection"
],
function($, _, Backbone, Marionette, app, AgentQueryCollection) {

    var DeployLogItemView = Marionette.ItemView.extend({
		template: "deploy-log-item",
        tagName: "tr",
        events: {
            "click td": "openLog"
        },

        openLog: function() {
            this.trigger("openLog");
        }
	});

	return Marionette.CompositeView.extend({
        itemView: DeployLogItemView,
        template: "deploy-log",
        itemViewContainer: "tbody",

        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close"
        },

        initialize: function(options) {

            this.agentName = options.agentName;
            this.unitName = options.unitName;
            this.on("itemview:openLog", this.openLog, this);

            this.collection = new AgentQueryCollection({
                agentUrl: "/deploylog/list/:unitName",
                agentName: options.agentName,
                unitName: options.unitName
            });

            this.collection.fetch();
        },

        serializeData: function() {
            return { agentName: this.agentName, unitName: this.unitName };
        },

        openLog: function(itemView) {
            var params = {
                 unitName: this.unitName,
                 agentName: this.agentName,
                 position: itemView.model.get("position")
            };

            window.open("/deploylog/file?" + $.param(params));
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        close: function() {
            $(".modal").modal("hide");
            this.undelegateEvents();
        }

    });



});