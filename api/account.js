var account   = require('../models/accountSchema.js');
var ApiError  = require('./apiError.js').ApiError;
var Promise   = require('bluebird');

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
        reject(new ApiError(error));
        return;
      }
      resolve(account);
    });
  });
};
