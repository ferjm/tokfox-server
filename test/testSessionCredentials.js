var server  = require('../server/app.js');
var opentok = require('../tokbox/opentok.js');
var request = require('supertest');
var sinon   = require('sinon');
var should  = require('should');

var app  = server.app;
var path = '/session/credentials';

describe(path, function() {
  var _sessionId = 'aSessionId';
  var _token = 'aToken';
  var _invalidSessionId = false;

  // We don't want to upload API key and secret details to travis, so we just
  // mock opentok.
  before(function() {
    sinon.stub(opentok, 'generateToken', function() {
      if (_invalidSessionId) {
        throw new Error('An invalid session ID was passed');
      }
      return _token;
    });
    sinon.stub(opentok, 'createSession', function(location, options, cb) {
      cb && cb(_sessionId);
    });
  });

  after(function() {
    opentok.generateToken.restore();
    opentok.createSession.restore();
    server.stop();
  });

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
        res.body.sessionId.should.be.exactly(_sessionId);
        res.body.token.should.be.exactly(_token);
        done();
      });
  });

  it('POST with valid sessionId and no role', function(done) {
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        res.body.sessionId.should.be.exactly(_sessionId);
        res.body.token.should.be.exactly(_token);
        done();
      });
  });

  it('POST with invalid sessionId and no role', function(done) {
    _invalidSessionId = true;
    request(app)
      .post(path)
      .expect(500)
      .type('json')
      .send('{"sessionId": "whatever"}')
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
        _invalidSessionId = false;
        done();
      });
  });

  it('POST with valid sessionId and valid role', function(done) {
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '", "role": "publisher"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        res.body.sessionId.should.be.exactly(_sessionId);
        res.body.token.should.be.exactly(_token);
        done();
      });
  });

  it('POST with valid sessionId and invalid role', function(done) {
    request(app)
      .post(path)
      .expect(500)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '", "role": "invalid"}')
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
        res.body.sessionId.should.be.exactly(_sessionId);
        res.body.token.should.be.exactly(_token);
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
