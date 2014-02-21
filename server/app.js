var express   = require('express');
var http      = require('http');

module.exports = (function() {
  var app = express();

  // Configure.
  require('./config')(app);

  // Routes.
  require('./routes')(app);

  // DB.
  var db = require('./db');

  function run() {
    http.createServer(app).listen(app.get('port'), function() {
      console.log('TokFox server listening on port ' + app.get('port'));
    });
  }

  function stop() {
    db.close();
  }

  return { run: run, stop: stop, app: app };
})();
