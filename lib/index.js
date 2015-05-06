var _ = require('lodash'),
    crypto = require('crypto'),
    debug = require('debug')('emerchantpay-paramsigner:signer'),
    sortedObject = require('sorted-object'),
    ParamSigner = require('./signer'),
    ParamAuthenticator = require('./authenticator');

/**
 * Export default singleton.
 *
 * @api public
//  */
// exports = module.exports = new ParamSigner();

/**
 * Expose constructors.
 */
exports.ParamSigner = ParamSigner
exports.ParamAuthenticator = ParamAuthenticator;
