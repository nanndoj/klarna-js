'use strict';

// Babel
require('babel/register');

var gulp = require('gulp');
var browserify = require('browserify');
var through2 = require('through2');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');

// Rerun the task when a file changes
gulp.task('watch', ['build-scripts'], function() {
  gulp.watch('./src/**/*.js', ['test','build-scripts']);
});

gulp.task('build-scripts',['test'],function () {
  return gulp.src('./src/js/index.js')
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path)
        .transform(require('babelify'))
          .bundle(function (err, res) {
            if (err) { return next(err); }
            file.contents = res;
            next(null, file);
          });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('./app/js'));
});

gulp.task('test', ['lint'], function () {
  return gulp.src('test/**/*.spec.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it 
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', ['sass'], function () {
  return gulp.src(['src/**/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});


// Default task
gulp.task('default', ['watch','sass:watch']);