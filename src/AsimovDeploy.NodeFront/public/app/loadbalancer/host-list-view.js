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

