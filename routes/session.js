var api         = require('../api/session.js');
var ServerError = require('../common/error.js').ServerError;

exports.getCredentials = function(req, res) {
  api.getCredentials(req.body.sessionId,
                     req.body.role)
  .then(function(credentials) {
    res.json(200, credentials);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};

exports.invite = function(req, res) {
  api.invite(req.body.sessionId,
             req.body.alias)
  .then(function(result) {
    res.json(200, result);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};

exports.acceptInvitation = function(req, res) {
  api.acceptInvitation(req.body.invitationId)
  .then(function(result) {
    res.json(200, result);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};

exports.rejectInvitation = function(req, res) {
  api.rejectInvitation(req.body.invitationId)
  .then(function() {
    res.json(200);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};
