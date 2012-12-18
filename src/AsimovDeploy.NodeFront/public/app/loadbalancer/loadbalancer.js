define([
    "jquery",
    "backbone",
    "app",
    "./host-list-view",
    "./settings-view"
],
function($, Backbone, app, HostListView, SettingsView) {
   
    var HostStatus = Backbone.Model.extend({
    });

    var HostStatusCollection = Backbone.Collection.extend({
        model: HostStatus,
        url: '/loadbalancer/listHosts'
    });

    var hosts = new HostStatusCollection();

    // public api
    var loadbalancer = {};
   
    app.vent.on("agent:event:loadBalancerStateChanged", function(data) {
        var host = hosts.get(data.id);
        host.set({enabled: data.enabled});
    });

    app.vent.on("loadbalancer:show", function() {
        app.mainRegion.show(new HostListView({ collection: hosts }));
        app.router.showRoute("loadbalancer");

        if (hosts.length === 0) {
            hosts.fetch();
        }
    });

    app.vent.on("loadbalancer:settings:show", function() {
        app.mainRegion.show(new SettingsView());

        app.router.showRoute("loadbalancer/settings");
    });

    return loadbalancer;
});