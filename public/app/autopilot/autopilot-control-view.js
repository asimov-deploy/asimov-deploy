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
    "underscore",
    "backbone",
    "marionette",
    "app"
],
function($, _, Backbone, Marionette, app) {
    return Marionette.ItemView.extend({
        template: "autopilot/autopilot-control-view",
        el: $("#asimov-autopilot-control"),

        events: {
            "click .btn-abort": "abort",
            "click .btn-continue": "continueDeploy"
        },

        initialize: function() {
            _.bindAll(this, "show");

            app.vent.on('autopilot:pause-deploy', this.render, this);
            app.vent.on('autopilot:continue-deploy', this.render, this);
            app.vent.on('autopilot:deploy-ended', this.hide, this);
        },

        serializeData: function() {
            return {
                paused: app.autopilot.paused
            };
        },

        show: function() {
            this.render();
            this.$el.hide();
            this.$el.slideDown();
        },

        hide: function() {
            this.$el.slideUp();
            this.undelegateEvents();
        },

        abort: function () {
            app.vent.trigger('autopilot:abort-deploy');
        },

        continueDeploy: function() {
            app.vent.trigger('autopilot:continue-deploy');
        }
    });
});