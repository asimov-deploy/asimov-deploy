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
    "marionette"
],
function($, Marionette) {

    return Marionette.ItemView.extend({
        template: "loadbalancer/loadbalancer-host-item",
        tagName: "tr",
        events: {
            "click .btn-enable": "enable",
            "click .btn-disable": "disable",
            "click .btn-clear": "clear"
        },

        initialize: function() {
            this.model.on("change:enabled", this.render, this);
            this.model.on("change:action", this.render, this);
        },

        enable: function() {
            this.model.set("action", "enable");
        },

        disable: function() {
            this.model.set("action", "disable");
        },

        clear: function() {
            this.model.set("action", null);
        }
    });

});

