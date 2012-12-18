define([
    "jquery",
    "marionette"
],
function($, Marionette) {

    return Marionette.ItemView.extend({
        template: "loadbalancer-host-item",
        tagName: "tr",
        events: {
            "click .btn-enable": "enable",
            "click .btn-disable": "disable",
            "click .btn-clear": "clear"
        },

        initialize: function() {
            this.model.on("change:enabled", this.render, this);
            this.model.on("change:action", this.render, this);
        },

        enable: function() {
            this.model.set("action", "enable");
        },

        disable: function() {
            this.model.set("action", "disable");
        },

        clear: function() {
            this.model.set("action", null);
        }
    });
    
});

