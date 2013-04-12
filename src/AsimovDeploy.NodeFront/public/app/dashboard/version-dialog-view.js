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
    "marionette",
    "backbone",
    "app",
    "../collections/agent-query-collection"
],
function($, _, Marionette, Backbone, app, AgentQueryCollection) {

    var VersionItemView = Marionette.ItemView.extend({
        template: "dashboard/version-item-view",
        tagName: "tr",

        events: {
            "click td": "versionSelected"
        },

        versionSelected: function() {
            this.trigger("versionSelected");
        }

    });

	return Marionette.CompositeView.extend({
        itemView: VersionItemView,
        template: "dashboard/version-dialog-view",
        itemViewContainer: "tbody",

        el: $("#asimov-modal"),

        events: {
            "click .btn-close": "close"
        },

        initialize: function(options) {

            this.on("itemview:versionSelected", this.versionSelected, this);

            this.collection = new AgentQueryCollection({
                agentUrl: "/versions/:unitName",
                agentName: options.agentName,
                unitName: options.unitName
            });

            this.collection.fetch();
        },

        show: function() {
            this.render();
            $(".modal").modal("show");
        },

        versionSelected: function(view) {
            this.close();
            this.trigger("versionSelected", view.model.get('id'), view.model.get('version'), view.model.get('branch'));
        },

        close: function() {
            $(".modal").modal("hide");
            this.undelegateEvents();
        }

    });

});