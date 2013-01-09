
var app = require('express')();
var eventSender = require('./eventSender');

eventSender.sendlog();

//eventSender.sendHeartBeat();

var deployUnits = [
	{
		"name": "Progressive.NET",
		"version": "1.0.0",
		"branch": "product",
		"info": "Hello from node agent"
	}
];

app.get('/units/list', function(req, res) {

	res.json(deployUnits);

});

app.get('/versions/:unitName', function(req, res) {

	res.json([
		{
			id: "version-id",
			timestamp: "2012-11-10 10:00:00",
			version: "1.2.0.0",
			branch: "master",
			commit: "2343123"
		}
	]);

});

app.post('/deploy/deploy', function(req, res) {
   res.json("ok");

   console.log("%j", req.body);

   eventSender.sendEvent({
		eventName: "deployStarted",
		unitName: "Progressive.NET",
		version: "100.0.0.1",
		branch: "uber"
   });

});



//var count = 0;

//setInterval(function() {
//	count += 1;

//	client.post('/agent/event', {
//			agentName: "NodeAgent",
//			unitName: "NodeDeploy",
//			eventName:  "unitDataUpdated",
//			unitData: {
//				version: "5.0." + count
//			}
//	}, function() {});

// }, 1000);


app.listen(4333);