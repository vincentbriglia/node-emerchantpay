var _ = require('lodash'),
    crypto = require('crypto'),
    debug = require('debug')('emerchantpay-paramsigner:authenticator'),
    sortedObject = require('sorted-object')

function ParamAuthenticator(secret, params) {

    var sentsignature = params.PS_SIGNATURE,
        checksignature = '',
        sigstring = secret,
        urlencstring = '';

    // sort parameters alphabetically
    params = sortedObject(params);

    _.forEach(params, function (value, key) {
        sigstring += '&' + key + '=' + value;
    });

    switch (params.PS_SIGTYPE) {
    case 'md5':
    case 'PSMD5':
        checksignature = crypto.createHash('md5').update(sigstring).digest('hex');
        break;
    case 'sha1':
    case 'PSSHA1':
        checksignature = crypto.createHash('sha1').update(sigstring).digest('hex');
        break;
    default:
        throw new Error('Unknown key signatureType :' + params.PS_SIGTYPE);
        return false;
    }

    if (sentsignature !== checksignature) {
        return false;
    }

    if (Date.now() > params.PS_EXPIRETIME) {
        return false;
    }

    delete params.PS_SIGNATURE;
    delete params.PS_EXPIRETIME;
    delete params.PS_SIGTYPE;

    return params;
}


module.exports = ParamAuthenticator;
