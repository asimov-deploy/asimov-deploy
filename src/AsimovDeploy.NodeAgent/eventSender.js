var restify = require('restify');

var client = restify.createJsonClient({ url: 'http://localhost:3333' });

module.exports = {
   sendHeartBeat: function() {
      var heartbeatData = {
         url: 'http://localhost:4333',
         apiKey: 'hej',
         version: '1.0.0',
         name: 'NODE-AGENT'
      };

      client.post('/agent/heartbeat', heartbeatData, function() {});
   },

   sendlog: function() {
     var logs = [{
         agentName: "NODE-AGENT",
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