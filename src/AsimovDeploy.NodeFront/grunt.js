module.exports = function(grunt) {

  grunt.initConfig({

    clean: ["dist/"],

    lint: {
      files: [
        "app/**/*.js", "public/app/**/*.js"
      ]
    },

    watch: {
      node_src: {
        files: ["*.js", "app/*.js"],
        tasks: "jshint"
      },

      ui_src: {
        files: ["public/**/*.js", "public/templates/*.handlebars" ],
        tasks: "default"
      },

      less: {
        files: ["**/*.less" ],
        tasks: "less"
      }

    },

    handlebars: {
      all: {
        src: './public/templates/',
        dest: 'dist/debug/templates.js'
      }
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    concat: {
      "dist/debug/require.js": [
        "public/libs/almond.js",
        "dist/debug/require.js",
        "public/libs/handlebars.runtime.js",
        "dist/debug/templates.js"
      ]
    },

    less: {
      bootstrap: {
        options: { paths: ["public/css/bootstrap/"]  },
        files: { 'dist/debug/bootstrap.css' : 'public/css/bootstrap/bootstrap.less'  }
      },
      asimov: {
        options: { paths: ["public/css/", "public/css/bootstrap/"] },
        files: { 'dist/debug/asimov.css' : 'public/css/asimov.less' }
      }
    },

    mincss: {
      "dist/release/asimov.css": [
        "dist/debug/bootstrap.css",
        "dist/debug/asimov.css"
      ]
    },

    min: {
      "dist/release/require.js": [
        "dist/debug/require.js"
      ]
    },

    requirejs: {
      mainConfigFile: "public/app/config.js",
      out: "dist/debug/require.js",
      name: "config",
      wrap: false
    },

    qunit: {
      all: ["test/qunit/*.html"]
    }

  });

  var exec = require('child_process').exec;

  grunt.registerMultiTask('handlebars', 'Precompile Handlebars template', function() {
    var self = this;
    var done = self.async();
    var templateDir = this.file.src;

    var handlebarsCmd = 'node_modules\\.bin\\handlebars ' + templateDir + ' -f ' + this.file.dest;
    exec(handlebarsCmd, done);
  });

  grunt.registerTask("default", "clean lint requirejs handlebars concat");

  grunt.registerTask("debug", "default");
  grunt.registerTask("release", "default min less mincss");

};
