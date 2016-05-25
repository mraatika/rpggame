var path = require('path');
var RewirePlugin = require('rewire-webpack');

module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'test/mocks/phaser.mock.js',
            'test/**/*.test.js'
        ],

        browsers: [
            'PhantomJS'
        ],

        preprocessors: {
            'test/**/*.test.js': ['webpack', 'sourcemap']
        },

        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-babel-preprocessor',
            'karma-sourcemap-loader'
        ],

        client: {
            mocha: {
                ui: 'bdd'
            }
        },

        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader?plugins=babel-plugin-rewire'
                },{
                    loader: 'script',
                    test: /(pixi|phaser).js/
                }]
            },

            devtool: 'inline-source-map',

            plugins: [
                new RewirePlugin()
            ],

            externals: {
                'phaser' : 'Phaser'
            },

            resolve: {
                root: path.resolve('./src')
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });
};