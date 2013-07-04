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
    "app"
],
function($, Backbone, app) {

    var UpdateLoadBalancerSettingsCommand = Backbone.Model.extend({
        url: "/loadbalancer/settings"
    });

    return Backbone.Marionette.ItemView.extend({
        template: "loadbalancer/loadbalancer-settings",

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

