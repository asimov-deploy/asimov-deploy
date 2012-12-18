define([
    "jquery",
    "underscore",
    "marionette"
],
function($, _, Marionette) {

	return Marionette.ItemView.extend({
        el: $("#asimov-modal"),
        template: "verify-log",
        events: {
            "click .btn-close": "close"
        },

        initialize: function() {
            _.bindAll(this, "show");
            this.model.on("change", this.render, this);
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        close: function() {
            $(".modal").modal("hide");
            this.model.off("change", this.render);
            this.undelegateEvents();
        }
    });

});