'use strict';
var assert = require('assert'),
  ParamSigner = require('./../lib/index').ParamSigner;

require('mocha-sinon');

describe('ParamSigner', function() {
  var secret = 'XYZ12345',
    clientId = '517243',
    formId = '1061',
    clock = null,
    ps;

  beforeEach(function(done) {
    clock = this.sinon.useFakeTimers();
    done();
  });

  afterEach(function(done) {
    clock.restore();
    done();
  });

  it('should fail if config.secret is not set', function(done) {
    assert.throws(function() {
      ps = new ParamSigner();
    }, Error);
    done();
  });

  it('should allow config.secret to be set', function(done) {
    ps = new ParamSigner({
      secret: secret,
    });

    assert.equal(ps.getSecret(), secret, 'error setting secret');

    done();
  });

  it('should fail if config.signatureType is not valid', function(done) {
    assert.throws(function() {
      ps = new ParamSigner({
        secret: secret,
        signatureType: 'bogus',
      });
    }, Error);
    done();
  });

  it('should allow config.lifetime to be set', function(done) {
    ps = new ParamSigner({
      secret: secret,
      lifetime: 24,
    });

    assert.equal(ps.getLifeTime(), 24, 'error setting lifetime');

    done();
  });

  it('should allow url to be set', function(done) {
    ps = new ParamSigner({
      secret: secret,
      url: 'https://payment-xxxxxxx.emerchantpay.com/payment/form/post',
    });

    assert.equal(
      ps.getUrl(),
      'https://payment-xxxxxxx.emerchantpay.com/payment/form/post',
      'error setting url'
    );

    done();
  });

  it('should allow params to be set', function(done) {
    ps = new ParamSigner(
      {
        secret: secret,
        lifetime: 24,
      },
      {
        client_id: clientId,
        form_id: formId,
      }
    );

    assert.equal(ps.getParam('client_id'), clientId, 'error setting client_id');
    assert.equal(ps.getParam('form_id'), formId, 'error setting form_id');

    done();
  });

  it('should allow config.signatureType to be set', function(done) {
    ps = new ParamSigner({
      secret: secret,
      signatureType: 'md5',
    });

    assert.equal(ps.getSignatureType(), 'md5', 'error setting md5');
    ps.setSignatureType('sha1');
    assert.equal(ps.getSignatureType(), 'sha1', 'error setting sha1');

    assert.throws(function() {
      ps.setSignatureType('bogus');
    }, Error);

    done();
  });

  it('should fail if config.url is not set', function(done) {
    assert.throws(function() {
      ps = new ParamSigner({
        secret: secret,
      });

      ps.getUrlWithQueryString();
    }, Error);
    done();
  });

  it('should fail if config.signatureType is not valid', function(done) {
    assert.throws(function() {
      ps = new ParamSigner({
        secret: secret,
        signatureType: 'bogus',
      });
    }, Error);
    done();
  });

  it('should return a valid querystring', function(done) {
    ps = new ParamSigner({
      secret: secret,
    });

    assert.equal(
      ps.getQueryString(),
      'PS_SIGNATURE=115ed2f366e9f98998c73e55edad7437&PS_EXPIRETIME=86400&PS_SIGTYPE=md5',
      'error getting querystring'
    );

    done();
  });

  it('should return a valid url', function(done) {
    ps = new ParamSigner({
      secret: secret,
      url: 'https://payment-xxxxxxx.emerchantpay.com/payment/form/post',
    });
    assert.equal(
      ps.getUrlWithQueryString(),
      'https://payment-xxxxxxx.emerchantpay.com/payment/form/post?PS_SIGNATURE=115ed2f366e9f98998c73e55edad7437&PS_EXPIRETIME=86400&PS_SIGTYPE=md5',
      'error getting url'
    );

    done();
  });

  it('should return a valid signature', function(done) {
    ps = new ParamSigner({
      secret: secret,
      url: 'https://payment-xxxxxxx.emerchantpay.com/payment/form/post',
    });
    assert.equal(
      ps.getSignature(),
      '115ed2f366e9f98998c73e55edad7437',
      'error getting signature string'
    );
    ps.setSignatureType('sha1');
    assert.equal(
      ps.getSignature(),
      'f0ceb50b62a291b078de9f8f5c9e3c8a54164560',
      'error getting signature string'
    );

    done();
  });
});
