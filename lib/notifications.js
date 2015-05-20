'use strict';

var debug = require('debug')('node-emerchantpay:events'),
    responseNOOP;

responseNOOP = function (notification, response) {
    debug('notification processed: "%s"', notification.notification_type);
    response.status(200).send('OK');
};

// Notification types
module.exports = exports = {
    'orderpending': responseNOOP,
    'orderdeclined': responseNOOP,
    'order': responseNOOP,
    'orderfailure': responseNOOP,
    'credit': responseNOOP,
    'cftpending': responseNOOP,
    'cftapproved': responseNOOP,
    'cftdeclined': responseNOOP,
    'cftrejected': responseNOOP,
    'settle': responseNOOP,
    'void': responseNOOP,
    'credentialsupdated': responseNOOP,
    'rebillcancel': responseNOOP,
    'rebillfailure': responseNOOP,
    'rebillsuccess': responseNOOP,
    'payoutapproved': responseNOOP,
    'payoutdeclined': responseNOOP,
    'chargeback': responseNOOP,
    'retrieval': responseNOOP,
    'representment': responseNOOP,
    'reversal': responseNOOP,
    'fraudalert': responseNOOP
};
