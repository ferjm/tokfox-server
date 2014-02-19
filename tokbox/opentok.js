var OpenTok = require('opentok'),
    fs = require('fs');

// Get API key and secret from local filesystem.
// For now we will only manage a single API key, but we might need to
// handle multiple API keys soon.
// We expose the API key so clients won't need to do any key selection logic
// if this is needed at some point.
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
opentok.apiKey = credentials.key;

module.exports = opentok;
