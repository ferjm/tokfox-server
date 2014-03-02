var ServerError = require('../common/error.js').ServerError;
var opentok     = require('../tokbox/opentok.js');
var OpenTokSDK  = require('opentok');
var Promise     = require('bluebird');

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

function _getCredentials(sessionId, role, resolve, reject) {
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

exports.getCredentials = function(sessionId, role) {
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
      _getCredentials(sessionId, role, resolve, reject);
    } else {
      getSessionId().then(function(sessionId) {
        _getCredentials(sessionId, role, resolve, reject);
      }).catch(function(e) {
        reject(e);
      });
    }
  });
};
