module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ["dist/"],

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

		handlebars: {
			compile: {
				options: { namespace: "JST"  },
				files: {
					"dist/debug/templates.js": "public/templates/**/*.handlebars"
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					mainConfigFile: "public/app/config.js",
					out: "dist/debug/require.js",
					name: "config",
					optimize: 'none'
				}
			}
		},

		concat: {
			dist: {
				src: ['public/libs/almond.js', 'dist/debug/require.js', 'public/libs/handlebars.runtime.js', 'dist/debug/templates.js'],
				dest: 'dist/debug/require.js'
			}
		},

		uglify: {
			dist: {
				files: {
					'dist/release/require.js': ['dist/debug/require.js']
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'dist/release/asimov.css': ['dist/debug/asimov.css'],
					'dist/release/bootstrap.css': ['dist/debug/bootstrap.css']
				}
			}
		},

		watch: {
			node_src: {
				files: ["*.js", "app/**/*.js"],
				tasks: ["jshint"]
			},

			ui_src: {
				files: ["public/**/*.js", "public/templates/**/*" ],
				tasks: ["default"]
			},

			less: {
				files: ["**/*.less" ],
				tasks: ["less"]
			}
		},

		jshint: {
			nodecode: {
				src: ['app/**/*.js'],
				options: { jshintrc: 'jshint-rules-nodejs.jshintrc' }
			},
			frontend: {
				src: ['public/app/**/*.js'],
				options: { jshintrc: 'jshint-rules-frontend.jshintrc' }
			}
		},

		mochaTest: {
			test: {
				options: { reporter: 'spec' },
				src: ['test/backend/**/*.js']
			}
		}

	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-notify');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'jshint', 'requirejs', 'less', 'handlebars', 'concat']);

	grunt.registerTask("release", ['default', 'cssmin', 'uglify', 'mochaTest']);

};