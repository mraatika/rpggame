'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../gulp.config').server;

gulp.task('server', function() {
    connect.server(config.settings);
});
