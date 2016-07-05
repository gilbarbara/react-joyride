/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top  */

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    del           = require('del'),
    runSequence   = require('run-sequence');

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*')
    .pipe($.babel())
    .pipe(gulp.dest('lib/scripts'));
});

gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*')
    .pipe($.eslint({
      useEslintrc: true,
      rules: {
        'no-console': 2
      }
    }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(gulp.dest('lib/styles'))
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

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', function() {
    gulp.start('scripts');
  });
});

gulp.task('build', ['clean'], function(cb) {
  process.env.NODE_ENV = 'production';
  runSequence('lint', 'scripts', 'styles', cb);
});

gulp.task('default', ['build']);
