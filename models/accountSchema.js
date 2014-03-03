var Invitation  = require('./invitationSchema.js');
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var accountSchema = new Schema({
  alias: {
    type: { type: String },
    value: { type: String, unique: true },
    verified: { type: Boolean },
  },
  pushEndpoints: [String],
  //TODO For now we only allow one invitation at a time.
  invitation: { type: [Invitation.schema] }
});

module.exports = mongoose.model('Account', accountSchema);
