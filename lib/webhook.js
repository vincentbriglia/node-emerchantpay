'use strict';

var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  _ = require('lodash'),
  debug = require('debug')('node-emerchantpay:webhook'),
  notifications = require('./notifications'),
  ParamAuthenticator = require('./authenticator');

function Webhook(config) {
  var self = this,
    mergedNotifications = {},
    notification;

  config = config || {};

  if (!config.secret) {
    throw new Error('config.secret not set');
  }

  return function(req, res, next) {
    debug('req.body "%o"', req.body);
    debug('config "%o"', config);

    try {
      notification = new ParamAuthenticator(
        {
          secret: config.secret,
        },
        req.body
      );

      self.emit('notification', notification);

      debug('default notifications overwritten with "%o"', config.notifications);

      // merge overwrites with existing defaults
      mergedNotifications = _.merge({}, notifications, config.notifications);

      debug('notifications "%o"', notifications);

      if (config.notifications && config.notifications[notification.notification_type]) {
        // if we've passed a custom callback for this type of method
        config.notifications[notification.notification_type](notification, res);
        // return;
      } else if (config.respond) {
        // if we're just wanting to respond with the notification and do something with it later
        req.eMerchantPayNotification = notification;
        next();
      } else {
        // otherwise use the default callbacks
        debug('notification "%o" %o', notification, res);
        mergedNotifications[notification.notification_type](notification, res);
      }
    } catch (err) {
      debug('error "%s"', err);
      self.emit('err', err);
      // next(err);
      res.status(400).send('NOT OK');
    }
  };
}

util.inherits(Webhook, EventEmitter);

module.exports = Webhook;
