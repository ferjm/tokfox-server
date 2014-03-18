var Alias         = require('./aliasSchema.js');
var Invitation    = require('./invitationSchema.js');
var mongoose      = require('mongoose');
var PushEndpoint  = require('./pushEndpointSchema.js');
var Schema        = mongoose.Schema;

var accountSchema = new Schema({
  alias: { type: [Alias.schema] },
  pushEndpoints: { type: [PushEndpoint.schema ] },
  //TODO For now we only allow one invitation at a time.
  invitation: { type: [Invitation.schema] }
});

module.exports = mongoose.model('Account', accountSchema);
