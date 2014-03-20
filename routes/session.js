var api         = require('../api/session.js');
var cors        = require('../common/cors.js');
var ServerError = require('../common/error.js').ServerError;

function apiRequest(method, args, req, res) {
  api[method].apply(null, args)
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
}

exports.create = function(req, res) {
  req._routeWhitelists.body = ['sessionId', 'role'];
  cors.allow(req, res);
  apiRequest('create', [req.body.sessionId, req.body.role], req, res);
};

exports.invite = function(req, res) {
  // TODO: Until we have a proper way to authenticate requests, we allow
  //       the caller to specify it alias. Just for demo purposes.
  req._routeWhitelists.body = ['sessionId', 'alias', 'callerAlias'];
  cors.allow(req, res);
  apiRequest('invite', [req.body.sessionId,
             req.body.alias, req.body.callerAlias], req, res);
};

exports.getInvitation = function(req, res) {
  cors.allow(req, res);
  apiRequest('getInvitation', [req.params.id], req, res);
};

exports.acceptInvitation = function(req, res) {
  apiRequest('acceptInvitation', [req.params.id], req, res);
};

exports.rejectInvitation = function(req, res) {
  apiRequest('rejectInvitation', [req.params.id], req, res);
};
