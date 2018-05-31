module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ["dist/"],

		less: {
			bootstrap: {
				options: { paths: ["public/css/bootstrap/"], javascriptEnabled: true  },
				files: { 'dist/debug/bootstrap.css' : 'public/css/bootstrap/bootstrap.less'  }
			},
			asimov: {
				options: { paths: ["public/css/", "public/css/bootstrap/"], javascriptEnabled: true },
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
				files: ["*.js", "app/**/*.js", "test/backend/*.js"],
				tasks: ["jshint", "mochaTest"]
			},

			ui_src: {
				files: ["public/**/*.js", "public/templates/**/*", "test/ui/**/*.js" ],
				tasks: ["default"]
			},

			less: {
				files: ["**/*.less" ],
				tasks: ["less"]
			}
		},

		jshint: {
			nodecode: {
				src: ['app/**/*.js', 'server.js', 'test/backend/*.js'],
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
		},

		karma: {
	        options: {
	            configFile: 'test/ui/karma-conf.js'
	        },
	        dev: {
	            autoWatch: true,
	            singleRun: false
	        },
	        prod: {
	            autoWatch: false,
	            singleRun: true,
	            reporters: ['dots']
	        }
	    }
	});

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
	grunt.loadNpmTasks('grunt-karma');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'jshint', 'requirejs', 'less', 'handlebars', 'concat', 'mochaTest', 'karma:prod']);

	grunt.registerTask("release", ['default', 'cssmin', 'uglify']);

};