/**
 * Failures due to invalid behavior from the client will produce a response
 * with HTTP status code in the "4XX" range and content-type of
 * "application/json". Failures due to an unexpected situation on the server
 * will produce a response with HTTP status code in the "5XX" range and
 * content-type of "application/json".
 * {
 *   "code": 400, // matches the HTTP status code
 *   "errno": 107, // stable application-level error number
 *   "error": "Bad Request", // string description of the error type
 *   "message": "the value of salt is not allowed to be undefined",
 *   "info": "https://docs.tokfox.com/errors or something" // link to more info
 *                                                         // on the error
 * }
 */

function ServerError(code, errno, error, message, info) {
  if (Array.isArray(message)) {
    message = message.join(' ');
  }

  if (typeof message === 'object') {
    try {
      message = message.toString();
    } catch(e) {}
  }

  this.code = code;
  this.errno = errno;
  this.error = error;
  this.message = message;
  this.info = info ||
              'https://github.com/ferjm/tokfox-server/blob/master/docs/api.md';
  console.error('SERVER ERROR: ' + this.code + ' - ' + this.errno + ' - ' +
                this.error);
  Error.captureStackTrace(this, ServerError);
}
ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.constructor = ServerError;

module.exports.ServerError = ServerError;
