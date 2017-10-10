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

module.exports = function(app, config) {

	var _ = require('underscore');
	var agentApiClient = require('./services/agent-api-client').create(config);

	app.get("/units/list", app.ensureLoggedIn, function(req, res) {
		var agentsResp = [];

		var filters = {
			agentGroups: req.query.agentGroups,
			unitGroups: req.query.unitGroups,
			unitTypes: req.query.unitTypes,
			tags: req.query.unitTags,
			units: req.query.units,
			unitStatus: req.query.unitStatuses
		};

		var skipStatusRefresh = (req.query.skipStatusRefresh || 'false') === 'true' ? true: false;

		agentApiClient.getUnits(filters, skipStatusRefresh, function(results) {
			results.forEach(function(item) {
				item.agent.groups.forEach(function (g) {
					agentsResp.push({
						name: item.agent.name,
						group: g,
						loadBalancerState: item.agent.loadBalancerState,
						units: item.units
					});
				});
			});

			res.json(agentsResp);
		});

	});

	app.get("/units/all", app.ensureLoggedIn, function(req, res) {
		res.json(config.agents);
	});

	var DELIMITER = ':';
	var AGENT_GROUP_PREFIX = 'ag';
	var UNIT_GROUP_PREFIX = 'ug';
	var UNIT_TYPE_PREFIX = 'ut';
	var TAG_PREFIX = 'tag';
	var UNIT_PREFIX = 'unit';
	var UNIT_STATUS_PREFIX = 'us';
	var PREFIXES = [
		AGENT_GROUP_PREFIX,
		UNIT_GROUP_PREFIX,
		UNIT_TYPE_PREFIX,
		TAG_PREFIX,
		UNIT_PREFIX,
		UNIT_STATUS_PREFIX
	];

	app.get("/units/auto-complete", app.ensureLoggedIn, function(req, res) {
		/*jshint maxcomplexity:10 */
		var q = req.query.q;
		var hasModifier = false;
		var hasModifierWithQuery = false;

		if (q) {
			PREFIXES.forEach(function (p) {
				if (q.toLowerCase().startsWith(p + DELIMITER)) {
					hasModifier = true;

					if (q.length > (p + DELIMITER).length) {
						hasModifierWithQuery = true;
					}
				}
			});
		}

		var response = [];

		if (q && q.toLowerCase().startsWith(UNIT_PREFIX + DELIMITER)) {
			var unitResponse = {
				text: 'Units',
				children: []
			};

			if (q.length > 5) {
				var arr = q.toLowerCase().split(DELIMITER);
				unitResponse.children.push(
					{
						id: UNIT_PREFIX + DELIMITER + arr[1],
						text: arr[1],
						selectionText: 'Unit: ' + arr[1],
						group: 'units'
					}
				);
			}
			res.json([unitResponse]);
			return;
		}

		var agentGroups = {
			text: 'Agent Groups (ag:)',
			children: config.getAgentGroups().map(function (agentGroup) {
				return {
					id: AGENT_GROUP_PREFIX + DELIMITER + agentGroup,
					text: agentGroup,
					prefix: AGENT_GROUP_PREFIX,
					selectionText: 'Agent Group: ' + agentGroup,
					group: 'agentGroups'
				};
			})
		};

		response.push(agentGroups);

		var unitGroups = {
			text: 'Unit Groups (ug:)',
			children: config.getUnitGroups().map(function (unitGroup) {
				return {
					id: UNIT_GROUP_PREFIX + DELIMITER + unitGroup,
					text: unitGroup,
					prefix: UNIT_GROUP_PREFIX,
					selectionText: 'Unit Group: ' + unitGroup,
					group: 'unitGroups'
				};
			})
		};

		response.push(unitGroups);

		var unitTypes = {
			text: 'Unit Types (ut:)',
			children: config.getUnitTypes().map(function (unitType) {
				return {
					id: UNIT_TYPE_PREFIX + DELIMITER + unitType,
					text: unitType,
					prefix: UNIT_TYPE_PREFIX,
					selectionText: 'Unit Type: ' + unitType,
					group: 'unitTypes'
				};
			})
		};

		response.push(unitTypes);

		var unitStatuses = {
			text: 'Unit Statuses (us:)',
			children: config.getUnitStatuses().map(function (status) {
				return {
					id: UNIT_STATUS_PREFIX + DELIMITER + status,
					text: status,
					prefix: UNIT_STATUS_PREFIX,
					selectionText: 'Status: ' + status,
					group: 'unitStatuses'
				};
			})
		};

		response.push(unitStatuses);

		var unitTags = {
			text: 'Tags (tag:)',
			children: config.getUnitTags().map(function (tag) {
				return {
					id: TAG_PREFIX + DELIMITER + tag,
					text: tag,
					prefix: TAG_PREFIX,
					selectionText: 'Tag: ' + tag,
					group: 'unitTags'
				};
			})
		};

		response.push(unitTags);

		if (q && !hasModifier) {
			var unitGroup = {
				text: 'Units (unit:)',
				children: [
					{
						id: UNIT_PREFIX + DELIMITER + q,
						text: q,
						prefix: UNIT_PREFIX,
						selectionText: 'Unit: ' + q,
						group: 'units'
					}
				]
			};

			response.push(unitGroup);
		}

		if (q) {
			response = _.map(response, function (group) {
				group.children = _.filter(group.children, function(s) {
					if (hasModifier) {
						var tokens = q.toLowerCase().split(":");
						return s.id.toLowerCase().startsWith(tokens[0]) &&
							   s.id.toLowerCase().indexOf(tokens[1]) !== -1;
					}

					return s.text.toLowerCase().indexOf(q.toLowerCase()) !== -1;
				});

				return group;
			});
			response = _.filter(response, function (group) {
				return group.children.length > 0;
			});
		}

		if (!hasModifier && (!q || q.length > 0)) {
			response = _.map(response, function (group) {
				if (group.children.length > 5) {
					group.children = group.children.slice(0, 3);
				}

				return group;
			});
		}

		res.json(response);
	});
};