define([
	"app"
], function(app) {

	app.addInitializer(function (){

		var socket = io.connect();
			socket.on('connect', function() {
		});

		socket.on('agent:log', function(data) {
			app.vent.trigger("agent:log", data);
		});

		socket.on("agent:event", function(data) {
			app.vent.trigger("agent:event:" + data.eventName, data);
		});
	});
	
});
