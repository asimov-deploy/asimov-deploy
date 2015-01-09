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

	return Marionette.ItemView.extend({
		el: $("#asimov-modal"),
		template: "dashboard/deploy-lifecycle-view",
		events: {
			"click .btn-close": "close",
			"submit" : "submit"
		},

		initialize: function() {
			_.bindAll(this, "show");
		},

		submit: function (e) {
			e.preventDefault();
			var form = $(e.target);
			var title = form.find('#title').val();
			var body = form.find('#body').val();
			this.trigger('submit', { body:body, title:title });
			this.close();
		},

		show: function() {
			this.render();
			$(".modal").modal("show");
		},

		close: function() {
			$(".modal").modal("hide");
			this.undelegateEvents();
		}
	});

});