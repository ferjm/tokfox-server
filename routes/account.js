var api         = require('../api/account.js');
var ServerError = require('../common/error.js').ServerError;

exports.create = function(req, res) {
  if (!req.body ||
      !req.body.alias || typeof req.body.alias !== 'object' ||
      !req.body.alias.type || !req.body.alias.value ||
      !req.body.pushEndpoint) {
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
    pushEndpoint: req.body.pushEndpoint
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
