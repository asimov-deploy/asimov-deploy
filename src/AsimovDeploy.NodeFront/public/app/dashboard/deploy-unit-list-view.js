define([
    "jquery",
    "marionette",
    "./deploy-unit-view",
    "app"
],
function($, Marionette, DeployUnitView, app) {

	return Marionette.CompositeView.extend({
		itemView: DeployUnitView,
		itemViewContainer: "tbody",

		template: "deploy-unit-list",

		events: {
			"click .btn-refresh": "refresh",
			"change .search-query": "filterUpdated"
		},

		initialize: function(options) {
			this.unfiltered = options.collection;
			this.collection = new this.collection.constructor(this.collection.models, this.collection.options);
			this.bindTo(this.unfiltered, "reset", this.applyFilter, this);
			this.loadFilterText();
			
			if (this.collection.length > 0) {
				this.applyFilter();
			}
		},

		refresh: function(e) {
			$(e.target).button("loading");

			this.unfiltered.fetch()
				.always(function() {
					$(e.target).button("reset");
				});
		},

		applyFilter: function() {

			var regEx = new RegExp(this.filterText, 'i');

			this.collection.reset(this.unfiltered.filter(function(item) {
				return regEx.exec(item.get('unitName')) !== null || regEx.exec(item.get('agentName')) !== null;
			}));
		},

		filterUpdated: function(e) {
			this.filterText = $(e.target).val();
			this.saveLoadFilterText();
			this.applyFilter();
		},

		serializeData: function() {
			return { filterText: this.filterText };
		},

		saveLoadFilterText: function() {
			if (localStorage) {
				localStorage.setItem('DeployUnitView:filter', this.filterText);
			}
		},

		loadFilterText: function() {
			this.filterText = "";

			if (localStorage) {
				var storedFilter = localStorage.getItem('DeployUnitView:filter');
				if (storedFilter) {
					this.filterText = storedFilter;
				}
			}

		}

	});
    
});