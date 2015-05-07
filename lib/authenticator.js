var _ = require('lodash'),
    crypto = require('crypto'),
    debug = require('debug')('node-emerchantpay:authenticator'),
    sortedObject = require('sorted-object')

function ParamAuthenticator(config, params) {

    config = config || {};
    params = params || {};

    if (!config.secret) {
        throw new Error('Secret not set');
        return false;
    }

    var sentsignature = params.PS_SIGNATURE,
        checksignature = '',
        sigstring = secret,
        now = Date.now();

    debug('params.PS_SIGNATURE "%s"', params.PS_SIGNATURE);
    debug('params.PS_SIGTYPE "%s"', params.PS_SIGTYPE);
    debug('params.PS_EXPIRETIME "%s"', params.PS_EXPIRETIME);

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
        throw new Error('Invalid PS_SIGTYPE: ' + params.PS_SIGTYPE);
        return false;
    }

    debug('checksignature "%s"', checksignature);

    if (sentsignature !== checksignature) {
        return false;
    }

    debug('now "%s"', now);
    debug('now > params.PS_EXPIRETIME "%s"', now > params.PS_EXPIRETIME);

    if (now > params.PS_EXPIRETIME) {
        return false;
    }

    delete params.PS_SIGNATURE;
    delete params.PS_EXPIRETIME;
    delete params.PS_SIGTYPE;

    return params;
}


module.exports = ParamAuthenticator;
