var account     = require('../models/accountSchema.js');
var phoneUtil   = require('libphonenumber').phoneUtil;
var Promise     = require('bluebird');
var ServerError = require('../common/error.js').ServerError;
var validator   = require('validator');

var AliasType = exports.AliasType = {
  MSISDN: 'msisdn'
};

var _isValidAlias = {
  'msisdn': function(msisdn) {
    try {
      return phoneUtil.parse(msisdn);
    } catch (e) {
      return false;
    }
  }
};

function _validateAlias(alias, reject) {
  if (!alias || !alias.type || !alias.value) {
    if (reject) {
      reject(new ServerError(400, 203, 'Wrong or missing alias'));
    }
    return false;
  }

  switch(alias.type) {
    case AliasType.MSISDN:
      if (!_isValidAlias[alias.type](alias.value)) {
        if (reject) {
          reject(new ServerError(400, 202, 'Wrong alias value',
                                 'Wrong alias value: ' + alias.value));
        }
        return false;
      }
      break;
    default:
      var aliasType = [];
      Object.keys(AliasType).forEach(function(key) {
        aliasType.push(AliasType[key]);
      });
      if (reject) {
        reject(new ServerError(400, 201, 'Wrong alias type',
                               'Alias should be one of: ' +
                               aliasType.join(', ')));
      }
      return false;
  }
  return true;
}

exports.isValidAlias = function(alias) {
  return _validateAlias(alias);
};

exports.createAccount = function(accountData) {
  return new Promise(function(resolve, reject) {
    // Alias validation.
    var alias = accountData.alias;
    if (!_validateAlias(alias, reject)) {
      return;
    }

    // Push endpoint validation.
    var pushEndpoint = accountData.pushEndpoint;
    if (!validator.isURL(pushEndpoint.invitation, {
          protocols: ['http', 'https'],
          require_protocol: true
        }) ||
        !validator.isURL(pushEndpoint.rejection, {
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

    accountObj.pushEndpoints.push({
      invitation: pushEndpoint.invitation,
      rejection: pushEndpoint.rejection,
      description: pushEndpoint.description
    });

    new account(accountObj).save(function(error, account) {
      if (error) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve(account);
    });
  });
};

exports.accountExists = function(alias) {
  return new Promise(function(resolve, reject) {
    // Alias validation.
    if (!_validateAlias(alias, reject)) {
      return;
    }

    // Account search.
    account.count({
      'alias.type': alias.type,
      'alias.value': alias.value
    }, function(err, count) {
      if (err) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve({
        'accountExists': (count > 0)
      });
    });
  });
};

exports.getAccount = function(alias) {
  return new Promise(function(resolve, reject) {
    if (!_validateAlias(alias, reject)) {
      return;
    }

    // Account search
    account.findOne({
      'alias.type': alias.type,
      'alias.value': alias.value
    }, function(err, account) {
      if (err) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve(account);
    });
  });
};

exports.addInvitation = function(accountId, invitation) {
  return new Promise(function(resolve, reject) {
    account.findOneAndUpdate({
      _id: accountId
    }, {
      invitation: invitation
    }, function(err, account) {
      if (err) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve(account.invitation[0]);
    });
  });
};

exports.removeInvitation = function(invitationId) {
  return new Promise(function(resolve, reject) {
    account.findOneAndUpdate({
      'invitation.version': invitationId
    }, {
      'invitation': []
    },function(err) {
      if (err) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      resolve();
    });
  });
};

exports.getInvitation = function(invitationId) {
  return new Promise(function(resolve, reject) {
    account.findOne({
      'invitation.version': invitationId
    }, function(err, account) {
      if (err) {
        reject(new ServerError(501, 101, 'Database error', error));
        return;
      }
      if (account) {
        resolve(account.invitation[0]);
        return;
      }
      resolve();
    });
  });
};
