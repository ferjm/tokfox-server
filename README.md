TokFox
=======
TokFox is a Telefónica Digital service that provides peer identification and peer discovery in a WebRTC connection.

Getting TokFox server
---
```sh
git clone https://github.com/ferjm/tokfox-server
cd tokfox-server
npm install
```

Running the server
---
Before running the server, you need to create the `tokbox/tokbox_credentials.json` file containing your [Tokbox API key and secret](http://www.tokbox.com/opentok/api/tools/js/apikey):

```json
{
  "key": "xxxxxx",
  "secret": "xxxxxx"
}
```

To run the server do a simple:
```sh
gulp
```

Running the tests
---
```sh
gulp test
```
