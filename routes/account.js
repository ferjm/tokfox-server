var api         = require('../api/account.js');
var ServerError = require('../common/error.js').ServerError;

exports.create = function(req, res) {
  req._routeWhitelists.body = ['alias', 'pushEndpoints'];
  if (!req.body ||
      !req.body.alias || typeof req.body.alias !== 'object' ||
      !req.body.alias.type || !req.body.alias.value ||
      !req.body.pushEndpoint || typeof req.body.pushEndpoint !== 'object' ||
      !req.body.pushEndpoint.invitation ||
      !req.body.pushEndpoint.rejection ||
      !req.body.pushEndpoint.description) {
    res.send(400, new ServerError(400, 104, 'Missing account information',
                                  'Request should contain an alias and a ' +
                                  'list of push endpoints'));
    return;
  }

  api.createAccount({
    alias: {
      type: req.body.alias.type,
      value: req.body.alias.value
    },
    pushEndpoint: {
      invitation: req.body.pushEndpoint.invitation,
      rejection: req.body.pushEndpoint.rejection,
      description: req.body.pushEndpoint.description
    }
  })
  .then(function() {
    res.send(200);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};

exports.exist = function(req, res) {
  req._routeWhitelists.body = ['aliasType', 'aliasValue'];
  if (!req.params.aliasType ||
      !req.params.aliasValue) {
    res.send(400, new ServerError(400, 105, 'Missing alias',
                                  'The request should contain a valid ' +
                                  'alias type and value'));
    return;
  }

  api.accountExists({
    type: req.params.aliasType,
    value: req.params.aliasValue
  }).
  then(function(response) {
    res.json(200, response);
  }).
  catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};

exports.update = function(req, res) {
  req._routeWhitelists.body = ['alias', 'pushEndpoints'];
  if (!req.params.aliasType ||
      !req.params.aliasValue) {
    res.send(400, new ServerError(400, 105, 'Missing alias',
                                  'The request should contain a valid ' +
                                  'alias type and value'));
    return;
  }

  api.update({
    type: req.params.aliasType,
    value: req.params.aliasValue
  }, {
    alias: req.body.alias,
    pushEndpoint: req.body.pushEndpoint
  })
  .then(function(response) {
    res.json(200, response);
  })
  .catch(function(error) {
    if (error.code) {
      res.send(error.code, error);
      return;
    }
    res.send(500, new ServerError(500, 999, 'Unknown error'));
  });
};
