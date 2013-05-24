define([
	'dashboard/unit-collection',
	'./testdata/unit-list-response-1'
], function (UnitCollection, unitListResponse1) {

	describe("UnitCollection", function() {

		describe("After fetching unit list", function() {

			var collection = new UnitCollection();

			beforeAll(function() {
				spyOn($, 'getJSON').andCallFake(function(url, callback) {
					callback(unitListResponse1);
				});

				collection.fetch();
			});

			it("deploy units should be grouped by name", function() {
				expect(collection.length).toBe(3);
			});

			it("deploy units should have name", function() {
				var unit = collection.at(1);
				expect(unit.get('name')).toBe('TouchWeb');
			});

			it("deploy units should have action list", function() {
				var unit = collection.at(1);
				expect(unit.get('actions').length).toBe(3);
			});

			it("deploy units should have instance collection", function() {
				var unit = collection.at(1);
				var instances = unit.get('instances');
				expect(instances.length).toBe(2);
			});

			it("deploy unit instance should have properties", function() {
				var unit = collection.at(1);
				var first = unit.get('instances').at(0);
				expect(first.get('status')).toBe('Running');
				expect(first.get('hasDeployParameters')).toBe(false);
			});

		});

	});

});




