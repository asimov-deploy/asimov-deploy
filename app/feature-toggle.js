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

var FeatureToggle = function(config) {

	this.getActiveFeature = function (key) {
		var activeFeatures = this.getActiveFeatures();
		return activeFeatures[key] || {};
	};

	this.getActiveFeatures = function() {

		if (!config.featureToggles) {
			return {};
		}

		var activeFeatures = {};
		var featureToggles = config.featureToggles;

		for (var property in featureToggles) {
			if (featureToggles.hasOwnProperty(property)) {
				var featureToggle = featureToggles[property];
				if (featureToggle.enabled === true) {
					activeFeatures[property] = featureToggle;
				}
			}
		}

		return activeFeatures;
	};
};

module.exports = {
	create: function(config) {
		return new FeatureToggle(config);
	}
};