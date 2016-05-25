'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var file = require('gulp-file');

gulp.task('heroku', ['build'], function() {
    return gulp.src('dist/index.html')
        .pipe(rename('home.html'))
        .pipe(file('index.php', '<?php include_once("home.html"); ?>'))
        .pipe(file('composer.json', '{}'))
        .pipe(gulp.dest('./dist'));
});