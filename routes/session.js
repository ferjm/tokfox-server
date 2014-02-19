var opentok = require('../tokbox/opentok.js');

exports.getCredentials = function(req, res) {
  var location = req.params.location;
  // Default to non-P2P session
  opentok.createSession(location, null, function(sessionId) {
    if (!sessionId) {
      res.send(500);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 'sessionId': sessionId }));
  });
};
