var restify = require('restify');

var client = restify.createJsonClient({ url: 'http://tranquil-mesa-7514.herokuapp.com' });

module.exports = {
   sendHeartBeat: function() {
      var heartbeatData = {
         url: 'http://localhost:4333',
         apiKey: 'hej',
         version: '1.0.0',
         name: 'NodeAgent'
      };

      client.post('/agent/heartbeat', heartbeatData, function() {});
   },

   sendlog: function() {
     var logs = [{
         agentName: "test",
         timestamp: "2012-05-10 10:00:00",
         time: "10:00:00",
         level: "info",
         message: "hello"
      }];

      client.post('/agent/log', logs, function() {});
   },

   sendEvent: function(data) {
      data.agentName = "NodeAgent";

      client.post('/agent/event', data, function() {});
   }
};