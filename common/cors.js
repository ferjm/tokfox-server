module.exports.allow = function allowCORS(aReq, aRes) {
  // Always allow CORS!!!
  if (aReq.headers.origin) {
    aRes.setHeader("Access-Control-Allow-Origin","*");
  }

  // Lets be VERY promiscuous... just don't do that on any serious server
  aRes.setHeader("Access-Control-Allow-Methods", "PUT, GET, OPTIONS, POST, DELETE");
  aRes.setHeader("Access-Control-Allow-Origin", "*");

  // If the request has Access-Control-Request-Headers headers, we should
  // answer with an Access-Control-Allow-Headers...
  var rh = aReq.headers["access-control-request-headers"];
  if (rh) { // We don't really care much about this...
    aRes.setHeader("Access-Control-Allow-Headers", rh);
  }
}
