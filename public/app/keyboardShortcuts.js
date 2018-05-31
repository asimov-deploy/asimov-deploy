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

	function isCtrlKey(evt) {
		return evt.ctrlKey;
	}

	function isKey(evt, keyChar) {
		return evt.key === keyChar;
	}

	$(document)
		.keydown(function(e) {
			/*jshint maxcomplexity:7 */
			if ($('#asimov-modal').is(":visible")) {
				return;
			}

			if (isCtrlKey(e) && isKey(e, 's')) {
				app.vent.trigger('focus-search-field');
				return false;
			}
		});
});
