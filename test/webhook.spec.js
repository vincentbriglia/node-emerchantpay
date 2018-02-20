'use strict';
var assert = require('chai').assert,
  Webhook = require('./../lib/index').Webhook;

require('mocha-sinon');

describe('Webhook', function() {
  var secret = 'XYZ12345',
    signature = '432781ed6bbfa8881e871e681c33d26e',
    clientId = '517243',
    expireTime = 86400,
    clock = null,
    req,
    res,
    nxt;

  beforeEach(function(done) {
    // mock the response statuses and asset them
    req = {};
    nxt = {};
    res = {
      status: function(status) {
        assert.equal(status, 200);
        return this;
      },
      send: function(content) {
        assert.equal(content, 'OK');
        return this;
      },
    };

    clock = this.sinon.useFakeTimers();
    done();
  });

  afterEach(function(done) {
    clock.restore();
    done();
  });

  it('should throw an error if no config.secret is set', function(done) {
    assert.throws(function() {
      return new Webhook();
    }, Error);
    done();
  });

  it('should send a 400 status when something is missing', function(done) {
    res.status = function(status) {
      assert.equal(status, 400);
      return this;
    };

    res.send = function(content) {
      assert.equal(content, 'NOT OK');
      done();
      return this;
    };

    return new Webhook({
      secret: secret,
    })(req, res, nxt);
  });

  it('should send a 200 status when everything is ok', function(done) {
    req.body = {
      PS_SIGNATURE: signature,
      PS_SIGTYPE: 'md5',
      PS_EXPIRETIME: expireTime,
      client_id: clientId,
      notification_type: 'order',
    };

    res = {
      status: function(status) {
        assert.equal(status, 200);
        return this;
      },
      send: function(content) {
        assert.equal(content, 'OK');
        done();
      },
    };

    return new Webhook({
      secret: secret,
      notifications: {
        order: function(notification, response) {
          response.status(200).send('OK');
        },
      },
    })(req, res, nxt);
  });

  it('should succeed and set req.eMerchantPayNotification if config.respond is set', function(done) {
    req.body = {
      PS_SIGNATURE: signature,
      PS_SIGTYPE: 'md5',
      PS_EXPIRETIME: expireTime,
      client_id: clientId,
      notification_type: 'order',
    };

    nxt = function() {
      assert.isObject(req.eMerchantPayNotification, 'req.eMerchantPayNotification is an object');
      assert.equal(req.eMerchantPayNotification.notification_type, 'order');
      assert.equal(req.eMerchantPayNotification.client_id, clientId);
      // ParamAuthenticator removes these, check if they're gone.
      assert.isUndefined(req.eMerchantPayNotification.PS_SIGNATURE);
      assert.isUndefined(req.eMerchantPayNotification.PS_SIGTYPE);
      assert.isUndefined(req.eMerchantPayNotification.PS_EXPIRETIME);
      done();
    };

    return new Webhook({
      secret: secret,
      respond: true,
    })(req, res, nxt);
  });

  it('should succeed and send set req.eMerchantPayNotification if config.respond is set', function(done) {
    req.body = {
      PS_SIGNATURE: signature,
      PS_SIGTYPE: 'md5',
      PS_EXPIRETIME: expireTime,
      client_id: clientId,
      notification_type: 'order',
    };

    res = {
      status: function(status) {
        assert.equal(status, 200);
        return this;
      },
      send: function(content) {
        assert.equal(content, 'OK');
        return done();
      },
    };

    return new Webhook({
      secret: secret,
    })(req, res, nxt);
  });
});
