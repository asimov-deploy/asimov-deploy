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

  var LiveLogFilterSelectionViewItem = Marionette.ItemView.extend({
      template: "live-log-filter-item",
      tagName: "li",
      events: {
         "click": "filterToggle"
      },

      initialize: function(){
         this.model.on('change', this.render, this);
      },

      filterToggle: function() {
         var show = this.model.get('show') ? false : true;
         this.model.set({show: show});

         $(this.el).toggleClass('show-filter-enabled', show);

         this.trigger("filterToggle");
      }

   });

   return Marionette.CollectionView.extend({
      itemView: LiveLogFilterSelectionViewItem,

      initialize: function() {
         this.on("itemview:filterToggle", this.filterToggle, this);
      },

      filterToggle: function() {
         var agents = this.collection.where({show: true});
         var names = agents.length > 0 ? _.pluck(agents, ["id"]) : null;

         app.vent.trigger("livelog:filterUpdated", names);
      }

   });

});