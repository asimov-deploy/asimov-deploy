define([
    "jquery",
    "underscore",
    "marionette",
    "backbone",
    "app",
    "../collections/agent-query-collection"
],
function($, _, Marionette, Backbone, app, AgentQueryCollection) {

    var VersionItemView = Marionette.ItemView.extend({
        template: "version-item-view",
        tagName: "tr",

        events: {
            "click td": "versionSelected"
        },

        versionSelected: function() {
            this.trigger("versionSelected");
        }

    });

	return Marionette.CompositeView.extend({
        itemView: VersionItemView,
        template: "version-dialog",
        itemViewContainer: "tbody",

        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close"
        },

        initialize: function(options) {

            this.on("itemview:versionSelected", this.versionSelected, this);

            this.collection = new AgentQueryCollection({
                agentUrl: "/versions/:unitName",
                agentName: options.agentName,
                unitName: options.unitName
            });

            this.collection.fetch();
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        versionSelected: function(view) {
            this.close();
            this.trigger("versionSelected", view.model.get('id'), view.model.get('version'), view.model.get('branch'));
        },

        close: function() {
            $(".modal").modal("hide");
            this.undelegateEvents();
        }

    });

});