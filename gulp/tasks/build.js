var gulp = require('gulp');
var webpack = require('gulp-webpack-build');
var connect = require('gulp-connect');

var formatOpts = {
    version: true,
    timings: true
};

var failOpts = {
    errors: true,
    warnings: false
};

var webpackConfig = {
    progress: true,
    colors: false
};

gulp.task('scripts', function() {
    return gulp
        .src('gulp/webpack.config.js')
        .pipe(webpack.init(webpackConfig))
        .pipe(webpack.run())
        .pipe(webpack.format(formatOpts))
        .pipe(webpack.failAfter(failOpts))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('build', ['lint', 'assets', 'images', 'scripts']);