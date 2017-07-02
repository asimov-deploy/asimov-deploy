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
	"app"
],
function($, app) {

	var aPressed = false;
	var lastKey = '';
	var isCtrl = false;

	$(document)
		.keydown(function(e) {
			if (e.ctrlKey) {
				isCtrl = true;
			}

			if (e.key === 'a') {
				aPressed = true;
			}

			if ((e.key === 'f' && isCtrl) ||
				(aPressed || lastKey === 'a') && e.key === 's') {
				app.vent.trigger('focus-search-field');
				return false;
			}

			if ((aPressed || lastKey === 'a') && e.key === 'c') {
				app.vent.trigger('units:collapse');
			}

			if ((aPressed || lastKey === 'a') && e.key === 'e') {
				app.vent.trigger('units:expand');
			}
		})
		.keyup(function(e) {
			if (e.ctrlKey) {
				isCtrl = false;
			}

			if (e.key === 'a') {
				aPressed = false;
			}

			lastKey = e.key;
		});
});
