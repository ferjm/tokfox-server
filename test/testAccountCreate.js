var request   = require('supertest');
var server    = require('../server/app.js');
var should    = require('should');
var mongoose  = require('mongoose');

var app  = server.app;
var path = '/account/';

describe(path, function() {
  var _validAliasType = 'msisdn';
  var _validAliasValue = '+34666200111';
  var _validPushEndpoint = 'http://arandomurl.com';

  before(function(done) {
    // We want to use our own test DB.
    server.dbEnabled = false;
    //mongoose.connect('mongodb://localhost/testdb' + Date.now());
    done();
  });

  after(function(done) {
    //mongoose.connection.db.dropDatabase();
    done();
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
      .expect(400)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.should.be.json;
        res.body.should.have.property('code');
        res.body.should.have.property('errno');
        res.body.should.have.property('error');
        res.body.should.have.property('message');
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(104);
        res.body.error.should.be.exactly('Missing account information');
        res.body.message.should.be.exactly('Request should contain an alias ' +
                                           'and a list of push endpoints');
        done();
      });
  });

/*
  it('POST with valid account details', function(done) {
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"alias":{"type": "' + _validAliasType + '",' +
            ' "value": "' + _validAliasValue + '"}, ' +
            ' "pushEndpoint": "' + _validPushEndpoint + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });
*/
  it('POST with invalid alias type', function(done) {
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"alias":{"type": "invalid",' +
            ' "value": "' + _validAliasValue + '"}, ' +
            ' "pushEndpoint": "' + _validPushEndpoint + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(201);
        res.body.error.should.be.exactly('Wrong alias type');
        res.body.message.should.be.exactly('Alias should be one of: msisdn');
        done();
      });
  });

  it('POST with invalid alias value', function(done) {
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"alias":{"type": "' + _validAliasType + '",' +
            ' "value": "invalid"}, ' +
            ' "pushEndpoint": "' + _validPushEndpoint + '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(202);
        res.body.error.should.be.exactly('Wrong alias value');
        res.body.message.should.be.exactly('Wrong alias value: invalid');
        done();
      });
  });

  it('POST with invalid push endpoint', function(done) {
    request(app)
      .post(path)
      .expect(400)
      .type('json')
      .send('{"alias":{"type": "' + _validAliasType + '",' +
            ' "value": "' + _validAliasValue + '"}, ' +
            ' "pushEndpoint": "invalid"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.code.should.be.exactly(400);
        res.body.errno.should.be.exactly(203);
        res.body.error.should.be.exactly('Wrong push endpoint value');
        res.body.message.should.be.exactly('Push endpoints must be valid ' +
                                           'HTTP or HTTPS urls');
        done();
      });
  });


});
