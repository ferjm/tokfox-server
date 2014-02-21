var gulp   = require('gulp');
var mocha  = require('gulp-spawn-mocha');
var server = require('./server/app.js');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
  server.run();
});

gulp.task('test', function () {
  return test().on('error', function (e) {
    throw e;
  });
});

gulp.task('lint', function() {
  gulp.src(['**/*.js', '!node_modules/**', '!test/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});


function test() {
  return gulp.src(['test/*.js'], {read: false}).pipe(mocha({
    R: 'spec'
  })).on('error', console.warn.bind(console));
}

