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
* Account
    * [POST /account/create](#post-accountcreate)

## POST /session/credentials
### Request
### Response

## POST /account/create
