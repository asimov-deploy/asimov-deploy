var specs = [];

// read specs from url params
// eg : spec_runner.html?using_spec=ui/mixin_example_spec&using_spec=data/example_spec
if(window.location.search) {
	var keyValuePairs = window.location.search.substring(1).split('&');
	keyValuePairs.forEach(function(pair) {
		var chunks = pair.split('=');
		var key = chunks[0];
		var value = chunks[1];
		if(key == 'using_spec') {
			specs.push('spec/' + value);
		}
	});
}

// or add manually
if (specs.length === 0) {
	specs = [
		'specs/unit-collection-specs'
	];
}