var gulp = require('gulp');
var mocha = require('gulp-mocha');
var server = require('./server/app.js');

gulp.task('default', function() {
  server.run();
});

gulp.task('test', function() {
  gulp.src('./test/*js')
      .pipe(mocha({ reporter: 'nyan' }));
});
