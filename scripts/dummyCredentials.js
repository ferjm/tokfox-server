// Create a dummy tokbox_credentials.json file, only to be used in
// travis CI runs.
fs = require('fs');
fs.writeFile('./tokbox/tokbox_credentials.json',
             '{ "key": "dummy", "secret": "dummy" }');
