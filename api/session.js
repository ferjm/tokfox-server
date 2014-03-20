var account     = require('./account.js');
var Alias       = require('../models/aliasSchema.js');
var opentok     = require('../tokbox/opentok.js');
var OpenTokSDK  = require('opentok');
var Promise     = require('bluebird');
var ServerError = require('../common/error.js').ServerError;
var request     = require('request');

function getToken(sessionId, role) {
  return opentok.generateToken({
    sessionId: sessionId,
    role: role
  });
}

function getSessionId() {
  return new Promise(function(resolve, reject) {
    opentok.createSession(null, null, function(sessionId) {
      if (!sessionId) {
        reject(new ServerError(400, 103, 'Create session error',
                               'Could not get a valid session ID'));
        return;
      }
      resolve(sessionId);
    });
  });
}

function getCredentials(sessionId, role, resolve, reject) {
  try {
    token = getToken(sessionId, role);
  } catch(e) {
    reject(new ServerError(400, 102, 'Get token error', e));
    return;
  }

  resolve({
    apiKey: opentok.apiKey,
    sessionId: sessionId,
    token: token
  });
}

exports.create = function(sessionId, role) {
  // For now, if no session ID is specified we just create a non-P2P session
  // per request
  return new Promise(function(resolve, reject) {
    // In the future we may want to restrict the role depending on the kind of
    // TokFox user, but for now we just check that role is a valid value in
    // case that it is provided.
    if (role &&
        role !== OpenTokSDK.RoleConstants.PUBLISHER &&
        role !== OpenTokSDK.RoleConstants.SUBSCRIBER &&
        role !== OpenTokSDK.RoleConstants.MODERATOR) {
      reject(new ServerError(400, 101, 'Not valid role value',
                             'The value of \'role\' should be one of: ' +
                             OpenTokSDK.RoleConstants.PUBLISHER + '/' +
                             OpenTokSDK.RoleConstants.SUBSCRIBER + '/' +
                             OpenTokSDK.RoleConstants.MODERATOR));
      return;
    }

    if (sessionId) {
      getCredentials(sessionId, role, resolve, reject);
    } else {
      getSessionId().then(function(sessionId) {
        getCredentials(sessionId, role, resolve, reject);
      }).catch(function(e) {
        reject(e);
      });
    }
  });
};

exports.invite = function(sessionId, alias, callerAlias) {
  return new Promise(function(resolve, reject) {
    if (!sessionId) {
      reject(new ServerError(400, 110, 'Missing sessionId',
             'You must provide a valid session ID'));
      return;
    }

    if (!alias || !account.isValidAlias(alias) ||
        (callerAlias && !account.isValidAlias(callerAlias))) {
      var aliasType = [];
      Object.keys(account.AliasType).forEach(function(key) {
        aliasType.push(account.AliasType[key]);
      });

      reject(new ServerError(400, 111, 'Invalid alias',
             'You must provide a valid alias. Allowed values are: ' +
             aliasType.join(', ')));
      return;
    }

    // Get the user if it exists.
    account.getAccount(alias)
    .then(function(receiverAccount) {
      if (!receiverAccount) {
        // The account is not registered, so we can't use the push
        // notification system. For now, we just bail out.
        // TODO: Other notification systems.
        reject(new ServerError(400, 112, 'Alias not found',
               'Can not notify unknown alias'));
        return;
      }

      // We have an account, so we can invite the user to join the session.

      // TODO: Check if the alias is verified, once we have alias verification.

      // TODO: We have no way to authenticate the request yet, so we allow the
      //       the caller to specify his alias. Only for demo purposes..
      account.addInvitation(receiverAccount._id, {
        'sessionId': sessionId,
        'callerAlias': callerAlias
      })
      .then(function(invitation) {
        // Notify the receiver user about the invitation via push.
        var notificationCount = 0;
        receiverAccount.pushEndpoints.forEach(function(endpoint) {
          // TODO: Check that the account is verified before sending the push
          //       notification.
          request.put({
            uri: endpoint.invitation,
            body: 'version=' + invitation.version,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }, function(error, request) {
            console.log('Push notification sent to ' + endpoint.invitation +
                        ' with version=' + invitation.version);
            notificationCount++;
            if (error) {
              reject(new ServerError(400, 113, 'Push notification error', error));
              return;
            }
            if (notificationCount === receiverAccount.pushEndpoints.length) {
              resolve({
                'sessionId': invitation.sessionId,
                'invitationId': invitation.version
              });
            }
          });
        });
      });
    });
  });
};

exports.getInvitation = function(invitationId) {
  return new Promise(function(resolve, reject) {
    if (!invitationId) {
      reject(new ServerError(400, 121, 'Missing invitation ID'));
      return;
    }

    account.getByInvitation(invitationId)
    .then(function(receiverAccount) {
      if (!receiverAccount || !receiverAccount.invitation) {
        reject(new ServerError(400, 122, 'Invalid invitation ID'));
        return;
      }
      resolve({
        callerAlias: receiverAccount.invitation[0].callerAlias[0] || {
          type: 'msisdn',
          value: 'Unknown'
        }
      });
    })
    .catch(function(e) {
      reject(new ServerError(400, 124, 'Error getting invitation', e));
    });
  });
};

exports.acceptInvitation = function(invitationId) {
  // When the user accepts an invitation, we generate the required credentials
  // corresponding to the session ID associated to the invitation, remove the
  // the invitation record and return these credentials, so the user can
  // connect to the TokBox session.
  return new Promise(function(resolve, reject) {
    if (!invitationId) {
      reject(new ServerError(400, 121, 'Missing invitation ID'));
      return;
    }

    // Get the details of the invitation.
    account.getByInvitation(invitationId)
    .then(function(receiverAccount) {
      if (!receiverAccount || !receiverAccount.invitation) {
        reject(new ServerError(400, 122, 'Invalid invitation ID'));
        return;
      }

      // Get the token for the session associated with the invitation.
      var token;
      var sessionId = receiverAccount.invitation[0].sessionId;
      try {
        token = getToken(sessionId, OpenTokSDK.RoleConstants.PUBLISHER);
      } catch(e) {
        reject(new ServerError(400, 102, 'Get token error', e));
        return;
      }

      // Get rid of the invitation.
      account.removeInvitation(invitationId)
      .then(function() {
        // And return the credentials.
        resolve({
          apiKey: opentok.apiKey,
          sessionId: sessionId,
          token: token
        });
      })
      .catch(function(e) {
        reject(new ServerError(400, 123, 'Error removing invitation', e));
      });
    })
    .catch(function(e) {
      reject(new ServerError(400, 124, 'Error getting invitation', e));
    });
  });
};

exports.rejectInvitation = function(invitationId) {
  return new Promise(function(resolve, reject) {
    if (!invitationId) {
      reject(new ServerError(400, 121, 'Missing invitation ID'));
      return;
    }

    // Get the account details.
    account.getByInvitation(invitationId)
    .then(function(receiverAccount) {
      if (!receiverAccount) {
        reject(new ServerError(400, 122, 'Invalid invitation ID'));
        return;
      }

      // Notify the user about the rejected invitation.
      var notificationCount = 0;
      receiverAccount.pushEndpoints.forEach(function(endpoint) {
        request.put({
          uri: endpoint.rejection,
          body: 'version=' + invitationId,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }, function(error, request) {
          console.log('Push notification sent to ' + endpoint.rejection +
                      ' with version=' + invitationId);
          notificationCount++;
          if (error) {
            reject(new ServerError(400, 113, 'Push notification error', error));
            return;
          }
          if (notificationCount === receiverAccount.pushEndpoints.length) {
            // TODO: We don't remove the invitation for now.
            resolve();
          }
        });
      });
    })
    .catch(function(e) {
      reject(new ServerError(400, 124, 'Error getting invitation', e));
    });
  });
};
