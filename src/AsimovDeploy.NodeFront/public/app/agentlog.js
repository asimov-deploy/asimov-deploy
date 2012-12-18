define([
	"jquery",
	"underscore",
	"backbone",
	"marionette",
	"app"
],
function($, _, Backbone, Marionette, app) {

	var LogItemView = Marionette.ItemView.extend({
		template: "agent-log-item"
	});

	var LogListView = Backbone.View.extend({

		events: {
			"dblclick": "toggleExpand"
		},

		initialize: function(){

			app.vent.on("agent:log", function(logItems) {
				var models = _.map(logItems, function(item) { return new Backbone.Model(item); });
				var views = _.map(models, function(m) { return new LogItemView({model: m}); });

				var fragment = document.createDocumentFragment();
				_.each(views, function(view) {
					view.render();
					fragment.appendChild(view.el);
				});

				this.$el.append(fragment);
				this.$el.scrollTop(this.$el[0].scrollHeight);

			}, this);
		},

		toggleExpand: function(){
			var current = Math.round($(this.el).height()) + "px";
			var min = $(this.el).css("min-height");
			var max = $(this.el).css("max-height");

			if (current == min) {
				$(this.el).animate({ height: max}, 500);
			} else {
				$(this.el).animate({ height: min}, 500);
			}
		}

	});

	app.addInitializer(function() {

		var agentLogView = new LogListView({ el: $(".agent-log") });

	});


});