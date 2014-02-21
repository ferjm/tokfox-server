var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var mocha   = require('gulp-spawn-mocha');
var server  = require('./server/app.js');
var spawn   = require('child_process').spawn;

gulp.task('default', function() {
  var mongod = spawn('mongod');
  var serverRunning = false;
  mongod.stdout.on('data', function(data) {
    if (!serverRunning) {
      serverRunning = true;
      server.run();
    }
  });
  mongod.stderr.on('data', function(data) {
    console.log(data);
  });
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
  return gulp.src(['test/*.js'], {read: false})
             .pipe(mocha({ R: 'spec' }))
             .on('error', console.warn.bind(console));
}
