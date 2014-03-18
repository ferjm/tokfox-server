var account = require('../api/account.js');
var opentok = require('../tokbox/opentok.js');
var Promise = require('bluebird');
var request = require('supertest');
var server  = require('../server/app.js');
var should  = require('should');
var sinon   = require('sinon');

var app   = server.app;
var path  = '/session/invitation/';

describe(path + ':id/', function() {
  var _invitationId = '123';
  var _sessionId = 'aSessionId';
  var _dummyAccount = {
    alias: { /*whatever*/ },
    pushEndpoints: {
      invitation: 'http://dummy',
      rejection: 'http://dummy',
      description: 'My description'
    },
    invitation: [{
      sessionId: _sessionId,
      version: Date.now()
    }]
  };
  var _token = 'aToken';

  // Stub control.
  var _invalidInvitation = false;
  var _invalidSessionId = false;
  var _removeInvitationError = false;

  before(function() {
    // We don't want the DB enabled.
    server.dbEnabled = false;

    // Stub account.getInvitation.
    sinon.stub(account, 'getByInvitation', function() {
      return new Promise(function(resolve, reject) {
        if (_invalidInvitation) {
          resolve(null);
          return;
        }
        resolve(_dummyAccount);
      });
    });

    // Stub account.removeInvitation.
    sinon.stub(account, 'removeInvitation', function() {
      return new Promise(function(resolve, reject) {
        if (_removeInvitationError) {
          reject();
          return;
        }
        resolve();
      })
    });

    // Stub opentok.generateToken(). Should be in sync with OpenTok nodejs
    // library.
    sinon.stub(opentok, 'generateToken', function() {
      if (_invalidSessionId) {
        throw new Error('An invalid session ID was passed');
      }
      return _token;
    });
  });

  after(function() {
    account.getByInvitation.restore();
    account.removeInvitation.restore();
    opentok.generateToken.restore();
  });

  it('PUT', function(done) {
    request(app)
      .put(path + _invitationId)
      .expect(404, done);
  });

  it('POST', function(done) {
    request(app)
      .post(path + _invitationId)
      .expect(404, done);
  });

  it('GET', function(done) {
    request(app)
      .get(path + _invitationId)
      .expect(200)
      .type('json')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.not.have.property('code');
        res.body.should.not.have.property('errno');
        res.body.should.not.have.property('error');
        res.body.should.not.have.property('message');
        res.body.should.have.property('apiKey');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('token');
        res.body.apiKey.should.be.exactly(opentok.apiKey);
        res.body.sessionId.should.be.exactly(_sessionId);
        res.body.token.should.be.exactly(_token);
        done()
      });
  });

  it('GET without invitation ID', function(done) {
    request(app)
      .get(path)
      .expect(404, done);
  });

  it('GET with invalid invitation ID', function(done) {
    _invalidInvitation = true;
    request(app)
      .get(path + _invitationId)
      .expect(400)
      .type('json')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('code');
        res.body.should.have.property('errno');
        res.body.should.have.property('error');
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(122);
        res.body.error.should.be.exactly('Invalid invitation ID');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        _invalidInvitation = false;
        done()
      });
  });

  it('GET with invalid session ID', function(done) {
    _invalidSessionId = true;
    request(app)
      .get(path + _invitationId)
      .expect(400)
      .type('json')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('code');
        res.body.should.have.property('errno');
        res.body.should.have.property('error');
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(102);
        res.body.error.should.be.exactly('Get token error');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        _invalidSessionId = false;
        done()
      });
  });

  it('GET with error removing invitation', function(done) {
    _removeInvitationError = true;
    request(app)
      .get(path + _invitationId)
      .expect(400)
      .type('json')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('code');
        res.body.should.have.property('errno');
        res.body.should.have.property('error');
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(123);
        res.body.error.should.be.exactly('Error removing invitation');
        res.body.should.not.have.property('apiKey');
        res.body.should.not.have.property('sessionId');
        res.body.should.not.have.property('token');
        _removeInvitationError = false;
        done()
      });
  });

});
