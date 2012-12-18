var restify = require('restify');

var client = restify.createJsonClient({ url: 'http://localhost:3333' });

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

   sendEvent: function(data) {
      data.agentName = "NodeAgent";

      client.post('/agent/event', data, function() {});
   }
};