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
    var DeployableUnitVersionItemView = Marionette.ItemView.extend({
        template: "autopilot/deployable-unit-version-item-view",
        tagName: "tr",

        events: {
            "click td": "changeVersion",
            "click input:checkbox": "toggleUnit"
        },

        changeVersion: function() {
            this.trigger("changeVersion", {
                unitName: this.model.get('unitName'),
                agentName: _.first(this.model.get('instances'))
            });
        },

        toggleUnit: function (evt) {
            evt.stopPropagation();
            this.trigger("toggleUnit", {
                unitName: this.model.get('unitName')
            });
        }
    });

    return Marionette.CompositeView.extend({
        itemView: DeployableUnitVersionItemView,
        template: "autopilot/configuration-dialog-view",
        itemViewContainer: "tbody",

        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close",
            "click .btn-danger": "close",
            "submit" : "submit"
        },

        initialize: function() {
            this.on("itemview:changeVersion", this.changeVersion, this);
            this.on("itemview:toggleUnit", this.toggleUnit, this);
        },

        submit: function (e) {
            e.preventDefault();
            var form = $(e.target);
            var deployToMaximumAgentsSimultaneously = parseInt(form.find('#deployToMaximumAgentsSimultaneously').val(), 10);
            var verificationIterationCount = parseInt(form.find('#verificationIterationCount').val(), 10);

            this.close();
            this.trigger('submit', {
                deployToMaximumAgentsSimultaneously: deployToMaximumAgentsSimultaneously,
                verificationIterationCount: verificationIterationCount
            });
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        changeVersion: function(evt, payload) {
            this.close();
            this.trigger("changeVersion", payload);
        },

        toggleUnit: function(evt, payload) {
            this.trigger("toggleUnit", payload);
        },

        close: function() {
            $(".modal").modal("hide");
            this.undelegateEvents();
        }
    });
});
