module.exports = function (config) {
    config.set({

        basePath: '',

        frameworks: ['browserify', 'mocha'],

        files: [
            'test/*.js',
        ],

        exclude: [],

        client: {
            mocha: {
                reporter: 'html',
                ui: 'bdd'
            }
        },

        preprocessors: {
            'test/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [ 'brfs' ]
        },

        reporters: ['progress'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: false,

        browsers: ['phantomJs'],

        singleRun: false,


        plugins: ['karma-browserify', 'karma-phantomjs-launcher']
    })
};
