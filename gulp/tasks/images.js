const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const config = require('../gulp.config').images;

gulp.task('images', () =>
    gulp.src(config.src)
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest))
);