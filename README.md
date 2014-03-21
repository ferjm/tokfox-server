TokFox
=======
TokFox is proof of concept of a service that provides peer identification and peer discovery in a WebRTC connection with [Tokbox](http://www.tokbox.com) as the WebRTC service provider.

Peer identification is done via MSISDN. There is no MSISDN verification and no authentication mechanism for the server requests so far.

* [Detailed API spec](/docs/api.md)
* [Data Flows](/docs/flows.md)

TokFox in action
---
Check [this video](https://vimeo.com/89703829) for a demo of a [TokFox client](https://github.com/ferjm/tokfox-firefoxos-demo) running in Firefox OS, Firefox and Firefox for Android (password protected).

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
Before running the server, you need to set your [Tokbox API key and secret](http://www.tokbox.com/opentok/api/tools/js/apikey):

```ssh
export TB_KEY=<Your Tokbox API key>
export TB_SECRET=<Your Tokbox API secret>
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
