var _ = require('lodash'),
    crypto = require('crypto'),
    debug = require('debug')('emerchantpay-paramsigner'),
    sortedObject = require('sorted-object');

function ParamSigner(config, params) {

  config = config || {};
  params = params || {};

  var secret = null,
      url = '',
      lifetime = 24,
      signatureType = 'md5';

  if (config.secret) {
    setSecret(config.secret);
  }

  if (params) {
    _.forEach(config.params, function (value, key) {
      setParam(key, value);
    });
  }

  return {
    setSecret: setSecret,
    setURL: setURL,
    setLifeTime: setLifeTime,
    setParam: setParam,
    getQueryString: getQueryString,
    getUrlWithQueryString: getUrlWithQueryString
  }

  function setURL(value) {
    debug('setURL "%s"', value);
    url = value;
  }

  function setSecret(value) {
    debug('setSecret "%s"', value);
    secret = value;
  };

  function setLifeTime(value) {
    debug('setLifeTime "%s"', value);
    lifetime = value;
  };

  function setSignatureType(value) {
    debug('setSignatureType "%s"', value);
    if (checkSignatureType(value)) {
      signatureType = value;
    } else {
      throw new Error('Invalid signatureType :' + value);
    }
  };

  function setParam(param, value) {
    debug('setParam "%s": "%s"', param, value);
    params[param] = value;
  };

  function getQueryString() {
    var retval = getSignature(true);
    debug('getQueryString "%s"', retval);
    return retval
  };

  function getUrlWithQueryString() {
    return url + '?' + getQueryString();
  }

  function getSignature(queryString) {
    if (typeof queryString === 'undefined') {
      queryString = false;
    }

    var signature = '',
        sigstring = secret,
        urlencstring = '';

    setParam('PS_EXPIRETIME', Date.now() + (3600 * lifetime));
    setParam('PS_SIGTYPE', signatureType);

    // sort parameters alphabetically
    params = sortedObject(params);

    _.forEach(params, function (value, key) {
      sigstring += '&' + key + '=' + value;
      urlencstring += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });

    switch (params.PS_SIGTYPE) {
      case 'md5':
      case 'PSMD5':
        signature = crypto.createHash('md5').update(sigstring).digest('hex');
        break;
      case 'sha1':
      case 'PSSHA1':
        signature = crypto.createHash('sha1').update(sigstring).digest('hex');
        break;
      default:
        throw new Error('Unknown key signatureType :' + params.PS_SIGTYPE);
    }

    if (queryString) {
      return 'PS_SIGNATURE=' + encodeURIComponent(signature) + urlencstring;
    } else {
      return signature;
    }
  };

  function checkSignatureType(value) {
    if (value === 'md5') {
      return true
    };
    if (value === 'sha1') {
      return true
    };
    return false;
  };

}

module.exports = ParamSigner;
