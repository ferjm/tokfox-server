var account     = require('../models/accountSchema.js');
var phoneUtil   = require('libphonenumber').phoneUtil;
var Promise     = require('bluebird');
var ServerError = require('../common/error.js').ServerError;
var validator   = require('validator');

var AliasType = exports.AliasType = {
  MSISDN: 'msisdn'
};

var isValidAlias = {
  'msisdn': function(msisdn) {
    try {
      return phoneUtil.parse(msisdn);
    } catch (e) {
      return false;
    }
  }
};

exports.createAccount = function(accountData) {
  return new Promise(function(resolve, reject) {
    // Alias validation.
    var alias = accountData.alias;
    switch(alias.type) {
      case AliasType.MSISDN:
        if (!isValidAlias[AliasType.MSISDN](alias.value)) {
          reject(new ServerError(400, 202, 'Wrong alias value',
                                 'Wrong alias value: ' + alias.value));
          return;
        }
        break;
      default:
        reject(new ServerError(400, 201, 'Wrong alias type',
                               'Alias should be one of: ' + AliasType.MSISDN));
        return;
    }

    // Push endpoint validation.
    var pushEndpoint = accountData.pushEndpoint;
    if (!validator.isURL(pushEndpoint, {
          protocols: ['http', 'https'],
          require_protocol: true
        })) {
      reject(new ServerError(400, 203, 'Wrong push endpoint value',
                             'Push endpoints must be valid HTTP or HTTPS ' +
                             'urls'));
      return;
    }

    var accountObj = {
      alias: {
        type: alias.type,
        // TODO: if the alias is an MSISDN we might want to store the whole
        //       phoneUtil.parse result
        value: alias.value,
        verified: false
      },
      pushEndpoints: []
    };

    accountObj.pushEndpoints.push(pushEndpoint);

    new account(accountObj).save(function(error, account) {
      if (error) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve(account);
    });
  });
};
