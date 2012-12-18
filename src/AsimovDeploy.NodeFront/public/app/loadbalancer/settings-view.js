define([
    "jquery",
    "backbone",
    "app"
],
function($, Backbone, app) {

    var UpdateLoadBalancerSettingsCommand = Backbone.Model.extend({
        url: "/loadbalancer/settings"
    });

    return Backbone.Marionette.ItemView.extend({
        template: "loadbalancer-settings",
        
        events: {
            "click .btn-update" : "update"
        },

        update: function() {

            new UpdateLoadBalancerSettingsCommand({
                host: $(".host", this.el).val(),
                password: $(".password", this.el).val()
            }).save();

            app.vent.trigger("loadbalancer:show");
        }

    });
    
});

