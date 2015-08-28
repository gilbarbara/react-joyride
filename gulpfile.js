var gulp                  = require('gulp'),
    $                     = require('gulp-load-plugins')(),
    del                   = require('del'),
    merge                 = require('merge-stream'),
    runSequence           = require('run-sequence'),
    AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

// Script
gulp.task('lint', function () {
    return gulp.src('lib/scripts/*')
        .pipe($.eslint({
            useEslintrc: true
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
        .pipe($.autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(gulp.dest('lib/styles'));
});

gulp.task('clean', function (cb) {
    del(['lib/styles/*.css'], cb);
});

gulp.task('build', function (cb) {
    process.env.NODE_ENV = 'production';
    runSequence('clean', 'lint', 'readme', 'assets', ['media', 'bundle'], 'sizer', cb);
});

gulp.task('default', ['serve']);

