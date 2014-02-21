var api = require('../api/account.js');

exports.create = function(req, res) {
  if (!req.body ||
      !req.body.alias || typeof req.body.alias !== 'object' ||
      !req.body.alias.type || !req.body.alias.value ||
      !req.body.pushEndpoint) {
    res.send(500, 'oh crap!');
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
    res.send(500, error);
  });
};
