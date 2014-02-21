var express   = require('express');
var http      = require('http');

module.exports = (function() {
  var app = express();
  var _dbEnabled = true;

  // Configure.
  require('./config')(app);

  // Routes.
  require('./routes')(app);

  function run() {
    if (_dbEnabled) {
      require('./db')();
    }
    http.createServer(app).listen(app.get('port'), function() {
      console.log('TokFox server listening on port ' + app.get('port'));
    });
  }

  return {
    run: run,
    app: app,
    set dbEnabled(enabled) {
      _dbEnabled = enabled;
    },
    get dbEnabled() {
      return _dbEnabled;
    }
  };
})();
