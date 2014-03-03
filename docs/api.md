# TokFox Server API

This document provides protocol-level details of the TokFox Server API.

___

# Overview

## URL Structure

All requests will be to URLs of the form:

    https://<server-url>/v1/<api-endpoint>

Note that:

* All API access must be over a properly-validated HTTPS connection.
* The URL embeds a version identifier "v1"; future revisions of this API may introduce new version numbers.

## Request Format

## Response Format

All successful requests will produce a response with HTTP status code of "200" and content-type of "application/json".  The structure of the response body will depend on the endpoint in question.

Successful responses will also include the following headers, which may be useful for the client:

* `Timestamp`:  the current POSIX timestamp as seen by the server, in integer seconds.

Failures due to invalid behavior from the client will produce a response with HTTP status code in the "4XX" range and content-type of "application/json".  Failures due to an unexpected situation on the server will produce a response with HTTP status code in the "5XX" range and content-type of "application/json".

To simplify error handling for the client, the type of error is indicated both by a particular HTTP status code, and by an application-specific error code in the JSON response body.  For example:

```js
{
  "code": 400, // matches the HTTP status code
  "errno": 107, // stable application-level error number
  "error": "Bad Request", // string description of the error type
  "message": "the value of salt is not allowed to be undefined",
  "info": "https://docs.endpoint/errors/1234" // link to more info on the error
}
```

Responses for particular types of error may include additional parameters.

The currently-defined error responses are:

* status code 400, errno 101:  Not valid role value
* status code 400, errno 102:  Get token error
* status code 400, errno 103:  Create session error
* status code 400, errno 201:  Wrong alias type
* status code 400, errno 202:  Wrong alias value
* status code 400, errno 203:  Wrong push endpoint value
* status code 501, errno 101:  Database error
* any status code, errno 999:  Unknown error

# API Endpoints

* Session
    * [POST /session/credentials](#post-sessioncredentials)
    * [POST /session/invite](#post-sessioninvite)
    * [POST /session/accept_invitation](#post-sessionaccept_invitation)
    * [POST /session/reject_invitation](#post-sessionreject_invitation)
* Account
    * [POST /account/create](#post-account_create)
    * [POST /account/delete](#post-accountdelete)
    * [POST /account/verify](#post-accountverify)
    * [POST /account/exists](#post-accountexists)

## POST /session/credentials
### Request
```ssh
POST /session/credentials HTTP/1.1
Content-Type: application/json

{
  "role": "publisher",
  "sessionId": "2_MX40NDYzMjUyMn5-TW9uIE1hciAwMyAwODoxNzo1MCBQU1QgM"
}
```

### Response
```ssh
HTTP/1.1 200 OK
Connection: close
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Content-Length: 494
Date: Mon, 03 Mar 2014 16:17:50 GMT

{
  "apiKey": "1234567",
  "sessionId": "2_MX40NDYzMjUyMn5-TW9uIE1hciAwMyAwODoxNzo1MCBQU1QgM",
  "token": "NTdlMzNkOGMxZjI3OTpzZXNzaW9uX2lkPTJfTVg0ME5EWXpNalV5TW41LVRXOXVJRTFoY2lBd015QXdPRG94TnpvMU1DQlFVMVFnTWpBeE5INHdMalkwTkRNd01qUi0mY3JlYXRlX3RpbWU9MTM5Mzg2MzQ3MCZub25jZT0zNTgxOSZyb2xlPSZzZXNzaW9uSWQ9Ml9NWDQwTkRZek1qVXlNbjUtVFc5dUlFMWhjaUF3TXlBd09Eb3hOem8xTUNCUVUxUWdNakF4Tkg0d0xqWTBORE13TWpSLQ=="
}
```

## POST /session/invite
### Request
### Response

## POST /session/accept_invitation
### Request
### Response

## POST /session/reject_invitation
### Request
### Response

## POST /account/create
### Request
```ssh
POST /account/create HTTP/1.1
Content-Type: application/json
{
  "alias": {
    "type": "msisdn",
    "value": "+34666200100"
  },
  "pushEndpoint": "http://arandomurl.com"
}
```
### Response
```ssh
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
X-Powered-By: Express
Content-Length: 2
Date: Mon, 03 Mar 2014 15:06:22 GMT

OK
```

## POST /account/delete
### Request
### Response

## POST /account/verify
### Request
### Response

## POST /account/exists
### Request
### Response
