require.config({

  deps: ["main"],

  paths: {
    // JavaScript folders
    libs: "../libs",

    // Libraries
    jquery: "../libs/jquery",
    underscore: "../libs/lodash",
    bootstrap: "../libs/bootstrap",
    backbone: "../libs/backbone",
    marionette: "../libs/backbone.marionette"
  },

  shim: {
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },

    bootstrap: {
       deps:["jquery"]
    }
    
  }

});



