var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    babelRegister = require('babel-register'),
    del           = require('del'),
    merge         = require('merge-stream'),
    runSequence   = require('run-sequence');

// Script
gulp.task('lint', function() {
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

gulp.task('test', function() {
    return gulp.src('tests/*.js', {
            read: false
        })
        .pipe($.mocha({
            reporter: 'spec',
            compilers: {
                js: babelRegister
            }
        }));
});

gulp.task('styles', function() {
    return gulp.src('lib/styles/*.scss')
        .pipe($.plumber())
        .pipe($.sass.sync({
            precision: 4
        }).on('error', $.sass.logError))
        .pipe($.plumber.stop())
        .pipe($.autoprefixer())
      .pipe($.rename({ suffix: '-compiled' }))
        .pipe(gulp.dest('lib/styles'));
});

gulp.task('clean', function(cb) {
    return del(['lib/styles/*.css'], cb);
});

gulp.task('build', ['clean'], function(cb) {
    process.env.NODE_ENV = 'production';
    runSequence('lint', 'styles', cb);
});

gulp.task('default', ['build']);
