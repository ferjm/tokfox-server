var mongoose  = require('mongoose');

var db = (function() {
  var DB_NAME = 'tokfox';
  var DB_HOST = 'localhost';

  mongoose.connect('mongodb://' + DB_HOST + '/' + DB_NAME);

  function close() {
    mongoose.connection.close();
  }

  return { close: close };
})();

module.exports = db;
