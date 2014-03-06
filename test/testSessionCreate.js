var opentok = require('../tokbox/opentok.js');
var request = require('supertest');
var server  = require('../server/app.js');
var sinon   = require('sinon');
var should  = require('should');

var app  = server.app;
var path = '/session/';

describe(path, function() {
  var _sessionId = 'aSessionId';
  var _token = 'aToken';
  var _invalidSessionId = false;

  // We don't want to upload API key and secret details to travis, so we just
  // mock opentok.
  before(function() {
    // We don't want the DB enabled.
    server.dbEnabled = false;
    // Stubs opentok.generateToken(). Should be in sync with OpenTok nodejs
    // library.
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
  });

  it('GET', function(done) {
    request(app)
      .get(path)
      .expect(404, done);
  });

  it('PUT', function(done) {
    request(app)
      .put(path)
      .expect(404, done);
  });

  it('DELETE', function(done) {
    request(app)
      .del(path)
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
      .expect(400)
      .type('json')
      .send('{"sessionId": "whatever"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(102);
        res.body.error.should.be.exactly('Get token error');
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
      .expect(400)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '", "role": "invalid"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(101);
        res.body.error.should.be.exactly('Not valid role value');
        res.body.message.should.be.exactly('The value of \'role\' should be ' +
                                           'one of: publisher/subscriber/moderator');
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
      .expect(400)
      .type('json')
      .send('{"role": "invalid"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(101);
        res.body.error.should.be.exactly('Not valid role value');
        res.body.message.should.be.exactly('The value of \'role\' should be ' +
                                           'one of: publisher/subscriber/moderator');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        done();
      });
  });
});
