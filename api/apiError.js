function ApiError(message) {
  if (Array.isArray(message)) {
    message = message.join(' ');
  }

  if (typeof message === 'object') {
    try {
      message = JSON.stringify(message);
    } catch(e) {}
  }

  this.message = message;
  this.name = "ApiError";
  Error.captureStackTrace(this, ApiError);
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports.ApiError = ApiError;
