var Alias     = require('./aliasSchema.js');
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var invitationSchema = new Schema({
  sessionId: { type: String },
  callerAlias: { type: [Alias.schema] },
  version: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
