var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var accountSchema = new Schema({
  alias: {
    type: { type: String },
    value: { type: String, unique: true },
    verified: { type: Boolean },
  },
  push_endpoints: [String]
});

module.exports = mongoose.model('Account', accountSchema);
