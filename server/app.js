var express = require('express');
var http    = require('http');

module.exports = (function() {
  var app = express();

  // Configure.
  require('./config')(app);

  // Routes.
  require('./routes')(app);

  function run() {
    http.createServer(app).listen(app.get('port'), function() {
      console.log('TokFox server listening on port ' + app.get('port'));
    });
  }

  return { run: run }
})();
