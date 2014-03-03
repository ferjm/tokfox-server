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
  res.send(500, new ServerError(500, 101, 'Not implemented'));
};

exports.acceptInvitation = function(req, res) {
  res.send(500, new ServerError(500, 101, 'Not implemented'));
};

exports.rejectInvitation = function(req, res) {
  res.send(500, new ServerError(500, 101, 'Not implemented'));
};
