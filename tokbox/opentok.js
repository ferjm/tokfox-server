var OpenTok = require('opentok');

// Get API key and secret from local filesystem.
// For now we will only manage a single API key, but we might need to
// handle multiple API keys soon.
// We expose the API key so clients won't need to do any key selection logic
// if this is needed at some point.

if (!process.env.TB_KEY || !process.env.TB_SECRET) {
  console.warning('Using dummy TokBox credentials');
}

var apiKey = process.env.TB_KEY || 'dummy';
var apiSecret = process.env.TB_SECRET || 'dummy';

if (!apiKey || !apiSecret) {
  console.error('ERROR: You need to set TB_KEY and TB_SECRET');
  process.exit(1);
}

var opentok = new OpenTok.OpenTokSDK(apiKey, apiSecret);
opentok.apiKey = apiKey;

module.exports = opentok;
