var path = require('path');
var webpack = require('webpack');
var gutil = require('gulp-util');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = gutil.env.type || 'dev';
var isProd = env === 'prod';

/**
 * UglifyJsPlugin options
 * @type {Object}
 */
var uglifyOptions = {
    mangle: false,
    compress: { warnings: false }
};

/**
 * CommonsChunkPlugin options
 * @type {Object}
 */
var commonsChunkOptions = {
    name: 'vendor',
    chunks: ['index'],
    filename: 'vendor' + (isProd ? '.min' : '') + '.js',
    minChunks: Infinity
};

/**
 * HtmlWebpackPlugin options
 * @type {Object}
 */
var htmlOptions = {
    template: './src/index.html'
};

/**
 * Plugins array. CommonsChunk and HtmlWebpackPlugin runs on dev and prod builds. Optimization
 * plugins are only used in prod mode
 * @type {Array}
 */
var plugins = [
    new webpack.optimize.CommonsChunkPlugin(commonsChunkOptions),
    new HtmlWebpackPlugin(htmlOptions)
];

if (isProd) {
    plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOptions));
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.optimize.DedupePlugin());
}

module.exports = {
    cache: true,

    target: 'web',

    debug: !isProd,

    devtool: isProd ? '' : 'eval',

    entry: {
        'app': './src/index.js',
        'vendor': ['phaser', 'lodash', 'webfontloader']
    },

    output: {
        path: 'dist',
        filename: '[name]' + (isProd ? '.min' : '') +'.js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },{
            loader: 'script',
            test: /(pixi|phaser|AStar).js/
        }]
    },

    plugins: plugins,

    externals: {
        'phaser' : 'Phaser'
    },

    resolve: {
        root: path.resolve('./src')
    }
};