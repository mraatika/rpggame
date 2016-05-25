'use strict';

var gulp = require('gulp');
var config = require('../gulp.config').watch;

gulp.task('watch', function() {
    var watchers = config.watchers;

    for (var i = 0, len = watchers.length; i < len; i++) {
        gulp.watch(watchers[i].src, watchers[i].tasks);
    }
});