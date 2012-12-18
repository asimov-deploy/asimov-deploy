require([
	"marionette"
],
function(Marionette) {

	Marionette.Renderer = {
		render: function (template, data) {
			return Handlebars.templates[template](data);
		}
	};

	Handlebars.registerHelper('ifEqFalse', function(conditional, options) {
		if(conditional === false) {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifUndefined', function(conditional, options) {
		if(conditional === undefined) {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifDeploying', function(options) {
		if(this.status === "Deploying") {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifTypeText', function(conditional, options) {
		if(conditional === "text") {
			return options.fn(this);
		}
	});

	Handlebars.registerHelper('ifTypePassword', function(conditional, options) {
		if(conditional === "password") {
			return options.fn(this);
		}
	});

	return {};

});