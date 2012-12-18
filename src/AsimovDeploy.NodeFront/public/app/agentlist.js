define([
   "jquery",
   "backbone",
   "marionette",
   "app"
],
function($, Backbone, Marionette, app) {

   var AgentItemView = Marionette.ItemView.extend({
      template: "agent-item-view",
      tagName: "tr"
   });

   var AgentListView = Marionette.CompositeView.extend({
      itemView: AgentItemView,
      itemViewContainer: "tbody",
      template: "agent-list-view"
   });

   var AgentCollection = Backbone.Collection.extend({
      url: "/agents/list"
   });

   var agentsList = new AgentCollection();

   app.vent.on("agentlist:show", function() {
      app.mainRegion.show(new AgentListView({collection: agentsList}));
      agentsList.fetch();

      app.router.showRoute("agents");
   });

   return {};

});