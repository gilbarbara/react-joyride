var gulp                  = require('gulp'),
    $                     = require('gulp-load-plugins')(),
    del                   = require('del'),
    merge                 = require('merge-stream'),
    runSequence           = require('run-sequence');

// Script
gulp.task('lint', function () {
    return gulp.src('lib/scripts/*')
        .pipe($.eslint({
            useEslintrc: true,
            rules: {
                "no-console": 2
            }
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('styles', function () {
    return gulp.src('lib/styles/*.scss')
        .pipe($.plumber())
        .pipe($.sass.sync({
            precision: 4
        }).on('error', $.sass.logError))
        .pipe($.plumber.stop())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('lib/styles'));
});

gulp.task('clean', function (cb) {
    del(['lib/styles/*.css'], cb);
});

gulp.task('build', function (cb) {
    process.env.NODE_ENV = 'production';
    runSequence('clean', 'lint', 'styles', cb);
});

gulp.task('default', ['build']);
