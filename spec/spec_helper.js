beforeEach(function() {
});

clientServer = function(host, port, callback) {
  var http = require('http');
  var client = http.createClient(port, host);
  return callback(client);
};

startServer = function () {
  require("../server.js");
};

put = function(endpoint, requestBody, callback) { return request('PUT', endpoint, requestBody, null, callback); };

post = function(endpoint, requestBody, specialHeaders, callback) {
  return request('POST', endpoint, requestBody, specialHeaders, callback);
};

del = function(endpoint, requestBody, callback) { return request('DELETE', endpoint, null, null, callback); };

request = function(method, endpoint, requestBody, specialHeaders, callback) {
  valid_methods = "GET PUT POST DELETE".split;
  requestBody = requestBody || '';
  specialHeaders = specialHeaders || {};
  if (!endpoint.match(/\:\/\//)) endpoint = "http://0.0.0.0:8081" + endpoint;
  var response;
  var body;
  var url = require('url').parse(endpoint);
  var clientResponse;
  var http = require('http');
  var client = http.createClient(url.port, url.hostname);
  var request = client.request(method, endpoint, specialHeaders, {'host': url.hostname });
  request.end();
  request.on('response', function (resp) {
    console.log('response received');
    if (typeof callback === "function") callback(resp);
  });
  waits(1000);
  return request;
};