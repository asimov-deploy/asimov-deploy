define([
   "jquery",
   "backbone"
],
function($, Backbone) {

   return Backbone.Model.extend({

      deployStarted: function(data) {
         this.set( {
               version: data.version,
               branch: data.branch,
               status: "Deploying",
               enableDeploy: false,
               info: ""
         });
      },

      deployFailed: function(data) {
         this.set( {
               version: data.version,
               branch: data.branch,
               status: "DeployFailed",
               info: "Deploy failed!"
         });
      },

      deployCompleted: function(data) {
         this.set( {
               version: data.version,
               branch: data.branch,
               status: data.status,
               info: "Deploy completed!"
         });
      }

   });

});