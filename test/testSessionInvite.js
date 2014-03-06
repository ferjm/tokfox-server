var account = require('../api/account.js');
var Promise = require('bluebird');
var request = require('supertest');
var Request = require('request');
var server  = require('../server/app.js');
var should  = require('should');
var sinon   = require('sinon');

var app   = server.app;
var path  = '/session/invitation/';

describe(path, function() {
  var _sessionId = 'aSessionId';
  var _aliasType = 'msisdn';
  var _aliasValue = '+34666222111';
  var _dummyAccount = {
    _id: '123',
    pushEndpoints: ['http://arandomurl']
  };

  // Stub controls.
  var _invalidAccount = false;
  var _invalidPutRequest = false;

  before(function() {
    // We don't want the DB enabled.
    server.dbEnabled = false;

    // Stub account.getAccount.
    sinon.stub(account, 'getAccount', function() {
      return new Promise(function(resolve, reject) {
        if (_invalidAccount) {
          resolve(null);
          return;
        }
        resolve(_dummyAccount);
      });
    });

    // Stub account.addInvitation.
    sinon.stub(account, 'addInvitation', function(notUsed, invitation) {
      return new Promise(function(resolve, reject) {
        resolve({
          sessionId: invitation.sessionId,
          version: Date.now()
        });
      });
    });

    // Stub request.
    sinon.stub(Request, 'put', function(notUsed, cb) {
      var error = _invalidPutRequest ? 'error' : undefined;
      cb && cb(error);
    });
  });

  after(function() {
    account.getAccount.restore();
    account.addInvitation.restore();
    Request.put.restore();
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
      .expect(200)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '",' +
            ' "alias": { "type": "' + _aliasType + '", ' +
            '            "value": "' + _aliasValue + '" }}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.not.have.property('code');
        res.body.should.not.have.property('errno');
        res.body.should.not.have.property('error');
        res.body.should.not.have.property('message');
        res.body.should.have.property('sessionId');
        res.body.should.have.property('invitationId');
        res.body.sessionId.should.be.exactly(_sessionId);
        done();
      });
  });

  it('POST without session ID', function(done) {
    request(app)
      .post(path)
      .expect(400)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(110);
        res.body.error.should.be.exactly('Missing sessionId');
        res.body.message.should.be.exactly('You must provide a valid session' +
                                           ' ID');
        res.should.not.have.property('sessionId');
        res.should.not.have.property('invitationId');
        done();
      });
  });

  it('POST without alias', function(done) {
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
        res.body.errno.should.be.exactly(111);
        res.body.error.should.be.exactly('Invalid alias');
        res.body.message.should.be.exactly('You must provide a valid alias.' +
                                           ' Allowed values are: msisdn');
        res.should.not.have.property('sessionId');
        res.should.not.have.property('invitationId');
        done();
      });
  });

  it('POST with invalid alias', function(done) {
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"sessionId": "whatever",' +
            ' "alias": { "type": "invalid" }}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(111);
        res.body.error.should.be.exactly('Invalid alias');
        res.body.message.should.be.exactly('You must provide a valid alias.' +
                                           ' Allowed values are: msisdn');
        res.should.not.have.property('sessionId');
        res.should.not.have.property('invitationId');
        done();
      });
  });

  it('POST with invalid account', function(done) {
    _invalidAccount = true;
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '",' +
            ' "alias": { "type": "' + _aliasType + '", ' +
            '            "value": "' + _aliasValue + '" }}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(112);
        res.body.error.should.be.exactly('Alias not found');
        res.body.message.should.be.exactly('Can not notify unknown alias');
        res.should.not.have.property('sessionId');
        res.should.not.have.property('invitationId');
        _invalidAccount = false;
        done();
      });
  });

  it('POST with failed push notification', function(done) {
    _invalidPutRequest = true;
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"sessionId": "' + _sessionId + '",' +
            ' "alias": { "type": "' + _aliasType + '", ' +
            '            "value": "' + _aliasValue + '" }}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(113);
        res.body.error.should.be.exactly('Push notification error');
        res.should.not.have.property('sessionId');
        res.should.not.have.property('invitationId');
        _invalidPutRequest = false;
        done();
      });
  });

});
