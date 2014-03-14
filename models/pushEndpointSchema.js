var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var pushEndpointSchema = new Schema({
  invitation: { type: String, unique: true },
  rejection: { type: String, unique: true },
  description: { type: String }
});

module.exports = mongoose.model('PushEndpoint', pushEndpointSchema);
