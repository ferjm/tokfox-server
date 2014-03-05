var session = require('../routes/session.js');
var account = require('../routes/account.js');

var router = function(app) {
  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // Sessions.
  app.post('/session/create', session.getCredentials);
  app.post('/session/invite', session.invite);
  app.post('/session/accept_invitation', session.acceptInvitation);
  app.post('/session/reject_invitation', session.rejectInvitation);

  // Accounts.
  app.post('/account/create', account.create);
};

module.exports = router;
