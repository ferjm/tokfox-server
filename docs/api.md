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

There is currently no authentication mechanism but we plan to use [Hawk](https://github.com/hueniverse/hawk) request signatures.

## Response Format

All successful requests will produce a response with HTTP status code of "200" and content-type of "application/json".  The structure of the response body will depend on the endpoint in question.

Failures due to invalid behavior from the client will produce a response with HTTP status code in the "4XX" range and content-type of "application/json".  Failures due to an unexpected situation on the server will produce a response with HTTP status code in the "5XX" range and content-type of "application/json".

To simplify error handling for the client, the type of error is indicated both by a particular HTTP status code, and by an application-specific error code in the JSON response body.  For example:

```js
{
  "code": 400, // matches the HTTP status code
  "errno": 777, // stable application-level error number
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
* status code 400, errno 110:  Missing session ID
* status code 400, errno 111:  Invalid alias
* status code 400, errno 112:  Alias not found
* status code 400, errno 113:  Push notification error
* status code 400, errno 121:  Missing invitation ID
* status code 400, errno 122:  Invalid invitation ID
* status code 400, errno 123:  Error removing invitation
* status code 400, errno 201:  Wrong alias type
* status code 400, errno 202:  Wrong alias value
* status code 400, errno 203:  Wrong push endpoint value
* status code 501, errno 101:  Database error
* any status code, errno 999:  Unknown error

# API Endpoints

* Session
    * [POST /session/](#post-session)
    * [POST /session/invitation](#post-sessioninvitation)
    * [GET /session/invitation/:id](#get-sessioninvitationid)
    * [DELETE /session/invitation/:id](#delete-sessioninvitationid)
* Account
    * [POST /account/](#post-account)
    * [PUT /account/:alias_type/:alias_value/](#put-accountalias_typealias_valueverify)
    * [GET /account/:alias_type/:alias_value](#get-accountalias_typealias_value)

## POST /session/

Creates a TokBox session and generate the required credentials to connect to it.

### Request

___Parameters___

* role - (optional) Can be *publisher*, *subscriber* or *moderator* (default).
* sessionId - (optional) Sometimes a client just want to get the credentials of a specific session. A session ID will be generated if none is provided with the request.

```ssh
POST /session/ HTTP/1.1
Content-Type: application/json

{
  "role": "publisher",
  "sessionId": "2_MX40NDYzMjUyMn5-TW9uIE1hciAwMyAwODoxNzo1MCBQU1QgM"
}
```

### Response

Successful requests will produce a "200 OK" response with the session credentials provided in the JSON body.

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
  "token": "NTdlMzNkOGMxZjI3OTpzZXNzaW9uX2lkPTJfTVg0ME5EWXpNalV5TW ..."
}
```

Failing requests may be due to the following errors:

* status code 400, errno 101:  Not valid role value
* status code 400, errno 102:  Get token error
* status code 400, errno 103:  Create session error

## POST /session/invitation

Invites a registered user to join to an existing TokBox session.

### Request

___Parameters___

* alias - Identifier of the invited user. Should be a valid alias of the form { 'type': 'msisdn', 'value': '+12345678'}. The only valid alias type so far is *msisdn*. More alias types will be added soon.
* sessionId - Session identifier.

```ssh
POST /session/invitation HTTP/1.1
Content-Type: application/json

{
  "alias": {
    "type": "msisdn",
    "value": "+34666201466"
  },
  "sessionId": "1_MX40NDYzMjUyMn5-V2VkIE1hciAwNSAwOTozNzo1NCBQU1QgMjAxNH4wLjE3NTQzNT"
}
```
### Response

Successful requests will produce a "200 OK" response with the invitation details provided in the JSON body.

```ssh
HTTP/1.1 200 OK
Connection: close
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Content-Length: 126
Date: Wed, 05 Mar 2014 18:41:58 GMT

{
  "sessionId": "1_MX40NDYzMjUyMn5-V2VkIE1hciAwNSAwOTozNzo1NCBQU1QgMjAxNH4wLjE3NTQzNT",
  "invitationId": 1394044918008
}
```

Failing requests may be due to the following errors:

* status code 400, errno 110:  Missing session ID
* status code 400, errno 111:  Invalid alias
* status code 400, errno 112:  Alias not found
* status code 400, errno 113:  Push notification error

## GET /session/invitation/:id

Allows the user to accept an invitation associated to a given invitation ID. The user will be provided with the required credentials to join the session as response to this request.

### Request

___Parameters___

* invitationId: Identifier of the invitation. This value is received via [SimplePush notification](https://developer.mozilla.org/en-US/docs/WebAPI/Simple_Push) as the value of *version*.

```ssh
GET /session/invitation/1394044918008 HTTP/1.1
Content-Type: application/json
```

### Response

Successful requests will produce a "200 OK" response with the session credentials provided in the JSON body.

```ssh
HTTP/1.1 200 OK
Connection: close
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Content-Length: 512
Date: Wed, 05 Mar 2014 18:42:09 GMT

{
  "apiKey": "1234567",
  "sessionId": "1_MX40NDYzMjUyMn5-V2VkIE1hciAwNSAwOTozNzo1NCBQU1QgMjAx",
  "token": "T1==cGFydG5lcl9pZD00NDYzMjUyMiZzaWc9YWNhY2MwNGMwNTJjNmYwMW9uS ..."
}
```

Failing requests may be due to the following errors:

* status code 400, errno 121:  Missing invitation ID
* status code 400, errno 122:  Invalid invitation ID
* status code 400, errno 123:  Error removing invitation

## DELETE /session/invitation/:id

Allows the user to reject an invitation associated to a given invitation ID.

### Request

__Parameters__

* invitationId: Identifier of the invitation. This value is received via [SimplePush notification](https://developer.mozilla.org/en-US/docs/WebAPI/Simple_Push) as the value of *version*.

```ssh
DELETE /session/invitation/1395164957654 HTTP/1.1
```
### Response

```ssh
HTTP/1.1 200 OK
Transfer-Encoding: Identity
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Connection: close
Date: Tue, 18 Mar 2014 17:49:41 GMT
```

Failing requests may be due to the following errors:

* status code 400, errno 113:  Push notification error
* status code 400, errno 122:  Invalid invitation ID

## POST /account/
### Request
```ssh
POST /account/ HTTP/1.1
Content-Type: application/json
{
  "alias": {
    "type": "msisdn",
    "value": "+34666200100"
  },
  "pushEndpoint": {
    "invitation": "http://arandomurl.com",
    "rejection": "http://anotherrandomurl.com",
    "description": "My device"
  }
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

## PUT /account/:alias_type/:alias_value

Allows the user to modify an existing account in the server. For now, users can only add new push endpoints.

___Parameters___

* alias (ignored)
* pushEndpoint

### Request
```ssh
PUT /account/msisdn/+34666200204 HTTP/1.1
Content-Type: application/json

{
  "pushEndpoint": {
    "invitation": "http://arandomurl.com",
    "rejection": "http://anotherrandomurl.com",
    "description": "A device"
  }
}
```
### Response
```ssh
HTTP/1.1 200 OK
Connection: close
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Content-Length: 780
Date: Tue, 18 Mar 2014 17:58:38 GMT

{
  "__v": 1,
  "_id": "53288395854b07f1c0de5020",
  "invitation": [
    {
      "sessionId": "1_MX40NDYzMjUyMn5-V2VkIE1hciAwNSAwOTozNzo1NCBQU1QgMjAxNH4wLjE3NTQzNTU0fg",
      "_id": "5328871d104d0421c17b7c61",
      "version": 1395164957654
    }
  ],
  "pushEndpoints": [
    {
      "invitation": "http://localhost:3001",
      "rejection": "http://localhost:3002",
      "description": "FxOS",
      "_id": "53288395854b07f1c0de5021"
    },
    {
      "invitation": "http://arandomurl.com",
      "rejection": "http://anotherrandomurl.com",
      "description": "A device",
      "_id": "5328894e104d0421c17b7c62"
    }
  ],
  "alias": [
    {
      "type": "msisdn",
      "value": "+34666200204",
      "verified": false,
      "_id": "53288395854b07f1c0de5022"
    }
  ]
}
```

Failing requests may be due to the following errors:

* status code 400, errno 203: Wrong push endpoint value
* status code 400, errno 204: Duplicated push endpoint
* status code 501, errno 101:  Database error

## GET /account/:alias_type/:alias_value

Allows the user to check if an account exists in the server.

### Request

___Parameters___

* aliasType
* aliasValue

```ssh
GET /account/msisdn/+34666200204 HTTP/1.1
```

### Response

```ssh
HTTP/1.1 200 OK
Connection: close
Etag: "805549393"
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Content-Length: 27
Date: Tue, 18 Mar 2014 17:53:43 GMT

{
    "accountExists": true
}
```
