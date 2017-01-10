/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top  */
var path = require('path');
var exec = require('child_process').exec;
var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    browserify  = require('browserify'),
    buffer      = require('vinyl-buffer'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    source      = require('vinyl-source-stream'),
    watchify    = require('watchify');

var shouldWatch = false;

function bundleScripts(options) {
  var bundler, rebundle, iteration = 0;
  bundler = browserify({
    entries: path.join(__dirname, '/test/demo/main.js'),
    basedir: __dirname,
    insertGlobals: false, // options.watch
    cache: {},
    // debug: options.watch,
    packageCache: {},
    fullPaths: false, // options.watch
    transform: [['babelify']],
    extensions: ['.jsx']
  });

  if (options.watch) {
    bundler = watchify(bundler);
  }

  rebundle = function() {
    var stream = bundler.bundle();

    if (options.watch) {
      stream.on('error', function(err) {
        console.log(err);
      });
    }

    stream
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(gulp.dest('.tmp'))
      .pipe($.tap(function() {
        if (iteration === 0 && options.cb) {
          options.cb();
        }
        iteration++;
      }))
      .pipe($.connect.reload());
  };

  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*')
    .pipe($.babel())
    .pipe(gulp.dest('lib/scripts'));
});

gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*')
    .pipe($.eslint({
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
  return del(['lib'], cb);
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

gulp.task('localserver', function(cb) {
  shouldWatch = true;

  gulp.watch(['src/styles/*', 'test/demo/*.scss'], function() {
    gulp.start('setup:styles');
  });

  return runSequence('setup:test', cb);
});

gulp.task('setup:test', ['setup:scripts', 'setup:styles'], function() {
  gulp.src('test/demo/index.html')
    .pipe(gulp.dest('.tmp'));

  return $.connect.server({
    root: [path.join(__dirname, 'test', 'demo'), path.join(__dirname, '.tmp/')],
    livereload: true,
    port: 8888
  });
});

gulp.task('setup:scripts', function(cb) {
  return bundleScripts({
    watch: shouldWatch,
    cb: cb
  });
});

gulp.task('setup:styles', function() {
  return gulp.src('test/demo/main.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      precision: 4
    }).on('error', $.sass.logError))
    .pipe($.plumber.stop())
    .pipe($.autoprefixer())
    .pipe($.rename({ basename: 'bundle' }))
    .pipe(gulp.dest('.tmp'))
    .pipe($.connect.reload());
});

gulp.task('test:ui', ['setup:test'], function(cb) {
  exec('./node_modules/.bin/nightwatch -c test/nightwatch.conf.js', function(error, stdout) {
    $.connect.serverClose();
    console.log(stdout);

    if (error) {
      console.error(`exec error: ${error}`);
      process.exit(1);
      return;
    }

    process.exit(0);
    cb();
  });
});

gulp.task('default', ['build']);
