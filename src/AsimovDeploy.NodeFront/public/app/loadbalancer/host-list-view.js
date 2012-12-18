define([
    "jquery",
    "backbone",
    "./host-item-view"
],
function($, Backbone, HostItemView) {

    var ChangeLoadBalancerStatusCommand = Backbone.Model.extend({
        url: "/loadbalancer/change"
    });

    return Backbone.Marionette.CompositeView.extend({
        itemView: HostItemView,
        template: "loadbalancer-host-list",
        itemViewContainer: "tbody",

        events: {
            "click .btn-change": "executeChange",
            "click .btn-refresh": "refresh"
        },
        
        executeChange: function() {
            var command = new ChangeLoadBalancerStatusCommand();
            command.set({hosts: this.collection});
            command.save();

            this.collection.forEach(function(host) {
                host.set({ action: null });
            });
        },

        refresh: function(e) {
            $(e.target).button("loading");
            this.collection.fetch()
                .always(function() {
                    $(e.target).button("reset");
                });
        }
    });
    
});

