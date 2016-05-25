'use strict';

var gulp = require('gulp');
var config = require('../gulp.config').assets;

gulp.task('assets', function() {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
