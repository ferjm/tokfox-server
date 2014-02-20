var request = require('supertest');
var should  = require('should');
var app     = require('../server/app.js').app;

var path = '/session/credentials';

describe(path, function() {
  it('GET', function(done) {
    request(app)
      .get(path)
      .expect(404, done);
  });

  it('POST', function(done) {
    request(app)
      .post(path)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        done();
      });
  });
});
