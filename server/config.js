var express   = require('express');

var config = function(app) {
  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
  });

  app.configure('dev', function() {
    app.use(express.errorHandler());
  });
};

module.exports = config;
