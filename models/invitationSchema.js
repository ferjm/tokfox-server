var Alias     = require('./aliasSchema.js');
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var invitationSchema = new Schema({
  sessionId: { type: String },
  callerAlias: {
    type: { type: String },
    value: { type: String }
  },
  version: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
