var session = require('../routes/session.js');
var account = require('../routes/account.js');

var router = function(app) {
  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // Sessions.
  app.post('/session/', session.create);
  app.post('/session/invitation/', session.invite);
  app.get('/session/invitation/:id', session.acceptInvitation);

  // Accounts.
  app.post('/account/', account.create);
};

module.exports = router;
