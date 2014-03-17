var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var pushEndpointSchema = new Schema({
  invitation: { type: String },
  rejection: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('PushEndpoint', pushEndpointSchema);
