define([
    "jquery",
    "backbone"
],
function($, Backbone) {

   return Backbone.Collection.extend({

        initialize: function(options) {
            this.agentName = options.agentName;
            this.unitName = options.unitName;
            this.agentUrl = options.agentUrl;
        },

        url: function() {
            var agentCallUrl = this.agentUrl.replace(":unitName", encodeURIComponent(this.unitName));
            var params = {
                url: agentCallUrl,
                agentName: this.agentName
            };

            return "/agent/query?" + $.param(params);
        }

    });
});