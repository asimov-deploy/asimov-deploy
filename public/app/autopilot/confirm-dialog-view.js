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
    "marionette"
],
function($, _, Backbone, Marionette) {
    return Marionette.ItemView.extend({
        template: "autopilot/confirm-dialog-view",
        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close",
            "click .btn-danger": "close",
            "click .btn-deploy": "deploy"
        },

        initialize: function() {
            _.bindAll(this, "show");
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        close: function() {
            $(".modal").modal("hide");
            this.undelegateEvents();
        },

        deploy: function() {
            this.close();
            this.trigger("deploy", this.model);
        }
    });
});
