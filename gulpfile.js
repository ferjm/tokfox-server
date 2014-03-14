var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var mocha   = require('gulp-spawn-mocha');
var server  = require('./server/app.js');

gulp.task('default', function() {
  server.run();
});

gulp.task('test', function () {
  return lint().pipe(test())
               .on('error', function(e) {
    throw e;
  });
});

gulp.task('lint', function() {
  return lint().on('error', function(e) {
    throw e;
  });
});

function lint() {
  return gulp.src(['**/*.js', '!node_modules/**', '!test/**'])
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
}

function test() {
  return gulp.src(['test/*.js'], {read: false})
             .pipe(mocha({ R: 'spec' }))
             .on('error', console.warn.bind(console));
}
