var mongoose  = require('mongoose');

var db = function() {
  var DB_NAME = 'tokfox';
  var DB_HOST = 'localhost';

  mongoose.connect('mongodb://' + DB_HOST + '/' + DB_NAME);
};

module.exports = db;
