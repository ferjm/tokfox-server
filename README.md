TokFox
=======
TokFox is a Telefónica Digital service that provides peer identification and peer discovery in a WebRTC connection.

[Detailed API spec](/docs/api.md)

Getting TokFox server
---
```sh
git clone https://github.com/ferjm/tokfox-server
cd tokfox-server
npm install
```

Requirements / Dependencies
---
* [Node.JS (>= 0.10.x)](http://nodejs.org/)
* [MongoDB (>= 2.4.x)](http://www.mongodb.org/)

Running the server
---
Before running the server, you need to create the `tokbox/tokbox_credentials.json` file containing your [Tokbox API key and secret](http://www.tokbox.com/opentok/api/tools/js/apikey):

```json
{
  "key": "xxxxxx",
  "secret": "xxxxxx"
}
```

You also need an instance of `mongod` running.

To run the server do a simple:
```sh
gulp
```

Running the tests
---
You need to have an instance of `mongod` running to be able to run the tests.

```sh
gulp test
```

Build status
---
[![Build Status](https://api.travis-ci.com/ferjm/tokfox-server.png?token=nVp5pzcZquCq324YePdz)](https://magnum.travis-ci.com/ferjm/tokfox-server)
