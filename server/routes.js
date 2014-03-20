var cors    = require('../common/cors.js');
var session = require('../routes/session.js');
var account = require('../routes/account.js');

var router = function(app) {
  // Home.
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('It works!');
  });

  // CORS.
  app.options('*', function(req, res) {
    cors.allow(req, res);
    res.send(200);
  });

  // Sessions.
  app.post('/session/', session.create);

  // Invitations.
  app.post('/session/invitation/', session.invite);
  app.get('/session/invitation/:id', session.getInvitation);
  app.put('/session/invitation/:id', session.acceptInvitation);
  app.del('/session/invitation/:id', session.rejectInvitation);

  // Accounts.
  app.post('/account/', account.create);
  app.get('/account/:aliasType/:aliasValue', account.exist);
  app.put('/account/:aliasType/:aliasValue', account.update);
};

module.exports = router;
