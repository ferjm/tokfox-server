var express = require('express'),
    http = require('http'),
    session = require('../routes/session.js');

module.exports = (function() {
  var app = express();

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
  });

  app.configure('dev', function() {
    app.use(express.errorHandler());
  });

  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // Sessions.
  app.post('/session/credentials', session.getCredentials);

  function run() {
    http.createServer(app).listen(app.get('port'), function() {
      console.log('TokFox server listening on port ' + app.get('port'));
    });
  }

  return { run: run }
})();
