var session = require('../routes/session.js');
var account = require('../routes/account.js');

var router = function(app) {
  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // Sessions.
  app.post('/session/credentials', session.getCredentials);

  // Accounts.
  app.post('/account/create', account.create);
};

module.exports = router;
