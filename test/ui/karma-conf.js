// Karma configuration

module.exports = function(config) {
    config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../../public',


    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: '../test/ui/assets/jquery.js', included: true},
        {pattern: '../test/ui/assets/jasmine-jquery.js', included: true},
        {pattern: 'app/**/*.js', included: false},
        {pattern: 'libs/**/*.js', included: false},
        {pattern: '../test/ui/specs/*.js', included: false},
        {pattern: '../test/ui/testdata/*.js', included: false},
        {pattern: '../test/ui/runner-config.js', included: true}
    ],


    // list of files to exclude
    exclude: [
         'libs/require.js',
         'app/main.js',
         'app/config.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['mocha'],
    mochaReporter: {
      output: 'autowatch'
    },
    transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    plugins: [
        'karma-jasmine',
        'karma-requirejs',
        'karma-phantomjs-launcher',
        'karma-mocha-reporter'
    ]
    });
};
