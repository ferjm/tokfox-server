var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var aliasSchema = new Schema({
  type: { type: String },
  value: { type: String, unique: true },
  verified: { type: Boolean }
});

module.exports = mongoose.model('Alias', aliasSchema);
