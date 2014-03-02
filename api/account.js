var account      = require('../models/accountSchema.js');
var ServerError  = require('../common/error.js').ServerError;
var Promise      = require('bluebird');

exports.createAccount = function(accountData) {
  return new Promise(function(resolve, reject) {
    var accountObj = {
      alias: {
        type: accountData.alias.type,
        value: accountData.alias.value,
        verified: false
      },
      push_endpoints: []
    };

    accountObj.push_endpoints.push(accountData.pushEndpoint);

    new account(accountObj).save(function(error, account) {
      if (error) {
        reject(new ServerError(501, 201, 'DBError ', error));
        return;
      }
      resolve(account);
    });
  });
};
