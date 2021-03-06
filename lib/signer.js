var crypto = require('crypto'),
  _ = require('lodash'),
  debug = require('debug')('node-emerchantpay:signer'),
  sortedObject = require('sorted-object');

function ParamSigner(config, params) {
  'use strict';

  config = config || {};

  var secret = null,
    url = '',
    lifetime = 24,
    signatureType = 'md5';

  if (!config.secret) {
    throw new Error('config.secret not set');
  } else {
    setSecret(config.secret);
  }

  if (config.url) {
    setURL(config.url);
  }

  if (config.lifetime) {
    setLifeTime(config.lifetime);
  }

  if (config.signatureType) {
    setSignatureType(config.signatureType);
  }

  if (!params) {
    params = {};
  } else {
    _.forEach(params, function(value, key) {
      setParam(key, value);
    });
  }

  function setURL(value) {
    debug('setURL "%s"', value);
    url = value;
  }

  function getUrl() {
    return url;
  }

  function setSecret(value) {
    debug('setSecret "%s"', value);
    secret = value;
  }

  function getSecret() {
    return secret;
  }

  function setLifeTime(value) {
    debug('setLifeTime "%s"', value);
    lifetime = value;
  }

  function getLifeTime() {
    return lifetime;
  }

  function setSignatureType(value) {
    debug('setSignatureType "%s"', value);
    if (checkSignatureType(value)) {
      signatureType = value;
    } else {
      throw new Error('Invalid PS_SIGTYPE: ' + value);
    }
  }

  function getSignatureType() {
    return signatureType;
  }

  function setParam(param, value) {
    debug('setParam "%s": "%s"', param, value);
    params[param] = value;
  }

  function getParam(param) {
    return params[param];
  }

  function getQueryString() {
    var retval = getSignature(true);
    debug('getQueryString "%s"', retval);
    return retval;
  }

  function getUrlWithQueryString() {
    if (!url) {
      throw new Error('config.url not set, optional but required for this method');
    }
    return url + '?' + getQueryString();
  }

  function getSignature(queryString) {
    if (typeof queryString === 'undefined') {
      queryString = false;
    }

    var signature = '',
      sigstring = secret,
      urlencstring = '',
      now = Math.floor(Date.now() / 1000);

    debug('getSignatureParams:before "%o"', params);

    setParam('PS_EXPIRETIME', now + 3600 * lifetime);
    setParam('PS_SIGTYPE', signatureType);

    debug('getSignatureParams:after "%o"', params);

    // sort parameters alphabetically
    params = sortedObject(params);

    _.forEach(params, function(value, key) {
      sigstring += '&' + key + '=' + value;
      urlencstring += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });

    switch (params.PS_SIGTYPE) {
      case 'md5':
        signature = crypto
          .createHash('md5')
          .update(sigstring, 'utf8')
          .digest('hex');
        break;
      default:
        signature = crypto
          .createHash('sha1')
          .update(sigstring, 'utf8')
          .digest('hex');
    }

    if (queryString) {
      return 'PS_SIGNATURE=' + encodeURIComponent(signature) + urlencstring;
    } else {
      return signature;
    }
  }

  function checkSignatureType(value) {
    if (value === 'md5') {
      return true;
    }
    if (value === 'sha1') {
      return true;
    }
    return false;
  }

  return {
    setSecret: setSecret,
    getSecret: getSecret,
    setURL: setURL,
    getUrl: getUrl,
    setLifeTime: setLifeTime,
    getLifeTime: getLifeTime,
    setSignatureType: setSignatureType,
    getSignatureType: getSignatureType,
    setParam: setParam,
    getParam: getParam,
    getQueryString: getQueryString,
    getSignature: getSignature,
    getUrlWithQueryString: getUrlWithQueryString,
  };
}

module.exports = ParamSigner;
