'use strict';

var gulp = require('gulp'),
  clean = require('del'),
  jade = require('gulp-jade'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  minify = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  webserver = require('gulp-webserver');

gulp.task('clean', function () {
  clean([ './public/*' ]);
  clean([ './tmp' ]);
});

gulp.task('jade', function () {
  return gulp.src('./src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public'));
});

gulp.task('es6', function () {
  return gulp.src('./src/app.js')
    .pipe(browserify({
      extensions: [ '.js'],
      transform: [ 'babelify' ],
      debug: true
    }))
    .pipe(gulp.dest('./tmp'))
    .pipe(rename({suffix: '.min', extname: '.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('less', function () {
  return gulp.src('./src/*.less')
    .pipe(less())
    .pipe(gulp.dest('./tmp'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minify({keepSpecialComments: 0}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('fonts', function () {
  return gulp.src('./node_modules/bootstrap/fonts/*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('build', ['clean', 'jade', 'es6', 'less'], function(cb) {
  cb();
});

gulp.task('watch', function (cb) {
  gulp.watch('./src/index.jade', ['jade']);
  gulp.watch([ './src/*.js' ], ['es6']);
  gulp.watch('./src/*.less', ['less']);
  cb();
});

gulp.task('serve', function () {
  return gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: 'index.html'
    }));
});

gulp.task('default', ['watch', 'build', 'serve'], function () {
  console.log('Gulp and running!');
});
