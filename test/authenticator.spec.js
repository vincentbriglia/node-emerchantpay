'use strict';
var assert = require('assert'),
  ParamAuthenticator = require('./../lib/index').ParamAuthenticator,
  ParamSigner = require('./../lib/index').ParamSigner,
  url = require('url');

require('mocha-sinon');

describe('ParamAuthenticator', function() {
  var secret = 'XYZ12345',
    clientId = '517243',
    formId = '1061',
    clock = null,
    pa,
    ps,
    signature,
    queryString;

  beforeEach(function(done) {
    clock = this.sinon.useFakeTimers();

    ps = new ParamSigner({
      secret: secret,
    });
    ps.setURL('https://payment-xxxxxxx.emerchantpay.com/payment/form/post');
    ps.setParam('client_id', clientId);
    ps.setParam('form_id', formId);

    // override these when you change stuff
    queryString = url.parse(ps.getUrlWithQueryString(), true).query;
    signature = ps.getSignature();

    done();
  });

  afterEach(function(done) {
    clock.restore();
    done();
  });

  it('should fail if no config.secret is set', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator();
    }, Error);
    done();
  });

  it('should fail if no params.PS_SIGNATURE is set', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator({
        secret: secret,
      });
    }, Error);
    done();
  });

  it('should fail if no params.PS_SIGTYPE is set', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator(
        {
          secret: secret,
        },
        {
          PS_SIGNATURE: signature,
        }
      );
    }, Error);
    done();
  });

  it('should fail if no params.PS_EXPIRETIME is set', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator(
        {
          secret: secret,
        },
        {
          PS_SIGNATURE: signature,
          PS_SIGTYPE: 'md5',
        }
      );
    }, Error);
    done();
  });

  it('should fail if wrong params.PS_SIGTYPE is set', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator(
        {
          secret: secret,
        },
        {
          PS_SIGNATURE: signature,
          PS_SIGTYPE: 'bogus',
          PS_EXPIRETIME: 151545454554,
        }
      );
    }, Error);
    done();
  });

  it('should fail if signatures don not match', function(done) {
    assert.throws(function() {
      pa = new ParamAuthenticator(
        {
          secret: secret,
        },
        {
          PS_SIGNATURE: signature,
          PS_SIGTYPE: 'md5',
          PS_EXPIRETIME: 151545454554,
        }
      );
    }, Error);
    done();
  });

  it('should fail if params.PS_EXPIRETIME is in the past', function(done) {
    // 24 hours in the past
    ps.setLifeTime(-24);

    assert.throws(function() {
      pa = new ParamAuthenticator(
        {
          secret: secret,
        },
        url.parse(ps.getUrlWithQueryString(), true).query
      );
    }, Error);
    done();
  });

  it('should accept md5 as params.PS_SIGTYPE', function(done) {
    ps.setSignatureType('md5');

    pa = new ParamAuthenticator(
      {
        secret: secret,
      },
      queryString
    );

    assert.ok(pa, 'md5 accepting required');

    done();
  });

  it('should accept sha1 as params.PS_SIGTYPE', function(done) {
    ps.setSignatureType('sha1');

    pa = new ParamAuthenticator(
      {
        secret: secret,
      },
      url.parse(ps.getUrlWithQueryString(), true).query
    );

    assert.ok(pa, 'sha1 accepting required');

    done();
  });
});
