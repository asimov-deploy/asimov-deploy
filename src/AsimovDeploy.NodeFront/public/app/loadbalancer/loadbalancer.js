/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

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