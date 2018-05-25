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

var DeployLifecycleSession = function() {

	var LocalStorage = require('node-localstorage').LocalStorage;
	var localStorage = new LocalStorage('./active-deploys');

	this.init = function(user, deployId, data) {
		var safeUser = user || { name: 'anonymous', id: 'anonymous'};
		var deployData = {};
		deployData.correlationId = deployId;
		deployData.user = safeUser.name || 'anonymous';
		deployData.data = data;

		var json = JSON.stringify(deployData);
		localStorage.setItem(deployId, json);
	};

	this.getDeploySession = function(deployId) {
		var item = localStorage.getItem(deployId);
		return JSON.parse(item);
	};

	this.end = function(deployId) {
		localStorage.removeItem(deployId);
	};
};

module.exports = {
	create: function() {
		return new DeployLifecycleSession();
	}
};