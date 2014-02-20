var gulp   = require('gulp');
var mocha  = require('gulp-mocha');
var server = require('./server/app.js');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
  server.run();
});

gulp.task('test', function() {
  gulp.src('./test/*js')
      .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('lint', function() {
  gulp.src(['**/*.js', '!node_modules/**', '!test/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});
