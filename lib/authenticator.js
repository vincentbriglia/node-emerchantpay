var _ = require('lodash'),
    crypto = require('crypto'),
    sortedObject = require('sorted-object'),
    debug = require('debug')('node-emerchantpay:authenticator');

function ParamAuthenticator(config, params) {

    'use strict';

    config = config || {};
    params = params || {};

    if (!config.secret) {
        throw new Error('config.secret not set');
    }

    if (!params.PS_SIGNATURE) {
        throw new Error('params.PS_SIGNATURE not set');
    }

    if (!params.PS_SIGTYPE) {
        throw new Error('params.PS_SIGTYPE not set');
    }

    if (!params.PS_EXPIRETIME) {
        throw new Error('params.PS_EXPIRETIME not set');
    }

    var sentsignature = params.PS_SIGNATURE,
        checksignature = '',
        sigstring = config.secret,
        now = Math.floor(Date.now() / 1000);

    debug('params.PS_SIGNATURE "%s"', params.PS_SIGNATURE);
    debug('params.PS_SIGTYPE "%s"', params.PS_SIGTYPE);
    debug('params.PS_EXPIRETIME "%s"', params.PS_EXPIRETIME);

    // unset the signature, because this isn't a parameter we want to use in the encoding
    delete params.PS_SIGNATURE;

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
    }

    debug('checksignature "%s"', checksignature);

    if (sentsignature !== checksignature) {
        throw new Error('params.PS_SIGNATURE does not match local signature');
    }

    debug('now "%s"', now);
    debug('now > params.PS_EXPIRETIME "%s"', now > params.PS_EXPIRETIME);

    if (now > params.PS_EXPIRETIME) {
        throw new Error('params.PS_EXPIRETIME is greater than the current time');
    }

    delete params.PS_EXPIRETIME;
    delete params.PS_SIGTYPE;

    return params;
}


module.exports = ParamAuthenticator;
