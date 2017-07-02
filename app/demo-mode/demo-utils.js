var _ = require('underscore');

function getCurrentTimeString() {
	var date = new Date();
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();

	if (hh > 12) {hh = hh - 12;}

	if (hh < 10) {hh = "0"+hh;}
	if (mm < 10) {mm = "0"+mm;}
	if (ss < 10) {ss = "0"+ss;}

	return hh+":"+mm+":"+ss;
}

function intersectionObjects2(a, b, areEqualFunction) {
	/*jshint loopfunc: true */
    var results = [];

	for (var i = 0; i < a.length; i++) {
		var aElement = a[i];
		var existsInB = _.any(b, function(bElement) { return areEqualFunction(bElement, aElement); });

		if (existsInB) {
			results.push(aElement);
		}
	}

    return results;
}

function intersectionObjects() {
    var results = arguments[0];
    var lastArgument = arguments[arguments.length - 1];
    var arrayCount = arguments.length;
    var areEqualFunction = _.isEqual;

    if (typeof lastArgument === "function") {
        areEqualFunction = lastArgument;
        arrayCount--;
    }

    for (var i = 1; i < arrayCount ; i++) {
        var array = arguments[i];
        results = intersectionObjects2(results, array, areEqualFunction);

		if (results.length === 0) {
			break;
		}
	}

	return results;
}

var _getUnitsByAgentGroup = function (units) {
	var unitsByAgentGroup = {};
	_
	.chain(units)
	.map(function (agentUnits) {
		return _.map(agentUnits.units, function (u) {
			return {
				agentGroup: agentUnits.group,
				agentName: agentUnits.name,
				unitName: u.name
			};
		});
	})
	.flatten()
	.groupBy('agentGroup')
	.map(function (value, key) {
		return {
			agentGroup: key,
			units: _.map(value, function (v) {
				return {
					agentName: v.agentName,
					unitName: v.unitName
				};
			})
		};
	})
	.sortBy('agentGroup')
	.each(function (x) {
		unitsByAgentGroup[x.agentGroup] = x.units;
	})
	.value();

	return unitsByAgentGroup;
};

var _getUnitsByUnitGroup = function (units) {
	var unitsByUnitGroup = {};
	_
	.chain(units)
	.map(function (agentUnits) {
		return _.map(agentUnits.units, function (u) {
			return {
				agentName: agentUnits.name,
				unitName: u.name,
				unitGroup: u.group
			};
		});
	})
	.flatten()
	.groupBy('unitGroup')
	.map(function (value, key) {
		return {
			unitGroup: key,
			units: _.map(value, function (v) {
				return {
					agentName: v.agentName,
					unitName: v.unitName
				};
			})
		};
	})
	.sortBy('unitGroup')
	.each(function (x) {
		unitsByUnitGroup[x.unitGroup] = x.units;
	})
	.value();

	return unitsByUnitGroup;
};

var _getUnitsByUnitType = function (units) {
	var unitsByUnitType = {};
	_
	.chain(units)
	.map(function (agentUnits) {
		return _.map(agentUnits.units, function (u) {
			return {
				agentName: agentUnits.name,
				unitName: u.name,
				unitType: u.type
			};
		});
	})
	.flatten()
	.groupBy('unitType')
	.map(function (value, key) {
		return {
			unitType: key,
			units: _.map(value, function (v) {
				return {
					agentName: v.agentName,
					unitName: v.unitName
				};
			})
		};
	})
	.sortBy('unitType')
	.each(function (x) {
		unitsByUnitType[x.unitType] = x.units;
	})
	.value();

	return unitsByUnitType;
};

var _getUnitsByUnitStatus = function (units) {
	var unitsByUnitStatus = {};
	_
	.chain(units)
	.map(function (agentUnits) {
		return _.map(agentUnits.units, function (u) {
			return {
				agentName: agentUnits.name,
				unitName: u.name,
				status: u.status
			};
		});
	})
	.flatten()
	.groupBy('status')
	.map(function (value, key) {
		return {
			status: key,
			units: _.map(value, function (v) {
				return {
					agentName: v.agentName,
					unitName: v.unitName
				};
			})
		};
	})
	.sortBy('status')
	.each(function (x) {
		unitsByUnitStatus[x.status] = x.units;
	})
	.value();

	return unitsByUnitStatus;
};

var _getUnitsByTags = function (units) {
	var unitsByTags = {};
	_
	.chain(units)
	.map(function (agentUnits) {
		return _.map(agentUnits.units, function (u) {
			return _.map(u.tags, function (v) {
				return {
					tag: v,
					agentName: agentUnits.name,
					unitName: u.name
				};
			});
		});
	})
	.flatten()
	.groupBy('tag')
	.map(function (value, key) {
		return {
			tag: key,
			units: _.map(value, function (v) {
				return {
					agentName: v.agentName,
					unitName: v.unitName
				};
			})
		};
	})
	.sortBy('tag')
	.each(function (x) {
		unitsByTags[x.tag] = x.units;
	})
	.value();

	return unitsByTags;
};

module.exports = {
	getCurrentTimeString: getCurrentTimeString,
	intersectionObjects: intersectionObjects,
	getUnitsByAgentGroup: _getUnitsByAgentGroup,
	getUnitsByUnitGroup: _getUnitsByUnitGroup,
	getUnitsByUnitType: _getUnitsByUnitType,
	getUnitsByUnitStatus: _getUnitsByUnitStatus,
	getUnitsByTags: _getUnitsByTags
};