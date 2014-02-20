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
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        done();
      });
  });

  it('POST with valid sessionId and no role', function(done) {
    var sessionId = '1_MX40NDYzMjUyMn5-VGh1IEZlYiAyMCAwODoyMDoyMSBQU1QgMjAx' +
                    'NH4wLjQ5NTkxMDgyfg';
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"sessionId": "' + sessionId + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        res.body.sessionId.should.be.exactly(sessionId);
        done();
      });
  });

  it('POST with invalid sessionId and no role', function(done) {
    var sessionId = 'invalidSessionId';
    request(app)
      .post(path)
      .expect(500)
      .type('json')
      .send('{"sessionId": "' + sessionId + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.name.should.be.exactly('ApiError');
        res.body.message.should.be.exactly(
          'Error: An invalid session ID was passed');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        done();
      });
  });

  it('POST with valid sessionId and valid role', function(done) {
    var sessionId = '1_MX40NDYzMjUyMn5-VGh1IEZlYiAyMCAwODoyMDoyMSBQU1QgMjAx' +
                    'NH4wLjQ5NTkxMDgyfg';
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"sessionId": "' + sessionId + '", "role": "publisher"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        res.body.sessionId.should.be.exactly(sessionId);
        done();
      });
  });

  it('POST with valid sessionId and invalid role', function(done) {
    var sessionId = '1_MX40NDYzMjUyMn5-VGh1IEZlYiAyMCAwODoyMDoyMSBQU1QgMjAx' +
                    'NH4wLjQ5NTkxMDgyfg';
    request(app)
      .post(path)
      .expect(500)
      .type('json')
      .send('{"sessionId": "' + sessionId + '", "role": "invalid"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.name.should.be.exactly('ApiError');
        res.body.message.should.be.exactly('Not valid role value');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        done();
      });
  });

  it('POST without sessionId and valid role', function(done) {
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"role": "publisher"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        done();
      });
  });

  it('POST without sessionId and invalid role', function(done) {
    request(app)
      .post(path)
      .expect(500)
      .type('json')
      .send('{"role": "invalid"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.name.should.be.exactly('ApiError');
        res.body.message.should.be.exactly('Not valid role value');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        done();
      });
  });
});
