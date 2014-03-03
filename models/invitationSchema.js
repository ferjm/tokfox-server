var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var invitationSchema = new Schema({
  sessionId: { type: String },
  callerAlias: {
    type: String,
    value: String
  },
  version: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
