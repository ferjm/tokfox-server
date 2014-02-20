var session = require('../routes/session.js');

var router = function(app) {
  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // Sessions.
  app.post('/session/credentials', session.getCredentials);
};

module.exports = router;
