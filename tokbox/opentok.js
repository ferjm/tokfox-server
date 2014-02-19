var OpenTok = require('opentok'),
    fs = require('fs');

// Get API key and secret from local filesystem.
// For now we will only manage a single API key, but we might need to
// handle multiple API keys soon.
var data = fs.readFileSync(__dirname + '/tokbox_credentials.json')
try {
  credentials = JSON.parse(data);
}
catch (err) {
  console.log('There has been an error parsing Tokbox credentials')
  console.log(err);
  return;
}

var opentok = new OpenTok.OpenTokSDK(credentials.key, credentials.secret);

module.exports = opentok;
