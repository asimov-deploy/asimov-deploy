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
    "marionette"
],
function($, _, Marionette) {

    var TemplateItemView = Marionette.ItemView.extend({
        template: "autopilot/deployable-unit-set-item-view",
        tagName: "tr",

        events: {
            "click td": "itemSelected"
        },

        itemSelected: function() {
            this.trigger("itemSelected");
        }

    });

    return Marionette.CompositeView.extend({
        itemView: TemplateItemView,
        template: "autopilot/deployable-unit-set-dialog-view",
        itemViewContainer: "tbody",

        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close",
            "click .btn-danger": "close"
        },

        initialize: function() {
            this.on("itemview:itemSelected", this.itemSelected, this);
        },

        itemSelected: function(view) {
            this.trigger("deployableUnitSetSelected", view.model.get('id'));
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        close: function() {
            $(".modal").modal("hide");
            this.trigger("closed");
            this.undelegateEvents();
        }
    });
});