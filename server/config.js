var express        = require('express');
var expressWinston = require('express-winston');
var winston        = require('winston');

var config = function(app) {
  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.errorHandler());
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}"
    }));
    app.use(app.router);
  });
};

module.exports = config;
