var request   = require('supertest');
var server    = require('../server/app.js');
var should    = require('should');
var mongoose  = require('mongoose');

var app  = server.app;
var path = '/account/create';

describe(path, function() {
  var _aliasType = 'aType';
  var _aliasValue = 'aValue';
  var _pushEndpoint = 'aPushEndpoint';

  before(function(done) {
    // We want to use our own test DB.
    server.dbEnabled = false;
    mongoose.connect('mongodb://localhost/testdb');
    done();
  });

  it('GET', function(done) {
    request(app)
      .get(path)
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

  it('POST with account details', function(done) {
    request(app)
      .post(path)
      .expect(200)
      .type('json')
      .send('{"alias":{"type": "' + _aliasType + '", "value": "' + _aliasValue + '"}, ' +
            '"pushEndpoint": "' + _pushEndpoint+ '"}')
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });
});
