var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var accountSchema = new Schema({
  alias: {
    type: String,
    value: String,
    verified: Boolean,
    unique: true
  },
  push_endpoints: [String]
});

module.exports = mongoose.model('Account', accountSchema);
