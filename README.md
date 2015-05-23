[![Build Status](https://travis-ci.org/vincentbriglia/node-emerchantpay.svg?branch=master)](https://travis-ci.org/vincentbriglia/node-emerchantpay)
[![Dependency Status](https://gemnasium.com/vincentbriglia/node-emerchantpay.svg)](https://gemnasium.com/vincentbriglia/node-emerchantpay)
[![Coverage Status](https://coveralls.io/repos/vincentbriglia/node-emerchantpay/badge.svg?branch=master)](https://coveralls.io/r/vincentbriglia/node-emerchantpay?branch=master)
[![Code Climate](https://codeclimate.com/github/vincentbriglia/node-emerchantpay/badges/gpa.svg)](https://codeclimate.com/github/vincentbriglia/node-emerchantpay)
[![Npm Version](https://badge.fury.io/js/node-emerchantpay.svg)](http://badge.fury.io/js/node-emerchantpay)

## Usage

This toolkit exposes 3 utilities: 
  * Parameter Signer (to sign and send)
  * Parameter Authenticator (to unsign and read signed parameters)
  * Express webhook (to process notification events)

### Signer

The signer is to sign form parameters to send to eMerchantPay

```JavaScript
app.get('/payment/', function (req, res) {

    var ParamSigner = require('node-emerchantpay').ParamSigner;
    // initialize it from the constructor
    var ps = new ParamSigner({
        // secret, url, lifetime, signatureType
        secret: 'xxxxxxxx',
        url: 'https://payment-xxxxxxxxx.emerchantpay.com/payment/form/post'
    }, {
        // key/value params
        'client_id': 'xxxxxxxxxx',
        'form_id': 'xxxxxxxxx'
    });
    // or initialize it using setters

    var ps = new ParamSigner();

    ps.setURL('https://payment-xxxxxxxxx.emerchantpay.com/payment/form/post');
    ps.setSecret('xxxxxxxx');
    ps.setParam('client_id', 'xxxxxxxx');
    ps.setParam('form_id', 'xxxxx');
    ps.setParam('test_transaction', 1);
    ps.setParam('item_1_code', 'premium');
    ps.setParam('item_1_predefined', 1);
    ps.setParam('customer_email', req.user.email);

    var url = ps.getUrlWithQueryString();

    return res.render('payment', {
        url: url
    });

});
```

```Jade
extends ../layouts/default

block body
  iframe(src='#{url}', frameborder='0', scrolling='0', border='0', style='width: 100%; height:100%; min-height:1600px;')
```

### Authenticator

The authenticator is to check the validity of incoming notifications from eMerchantPay

```JavaScript
app.get('/payment/', function (req, res) {
    var ParamAuthenticator = require('node-emerchantpay').ParamAuthenticator;
    var pa = new ParamAuthenticator({
        secret: 'xxxxxxx'
    }, req.body); // returs true or false or throws an error
});
```

### Webhook

The webhook is there to hook into express and also to provide you with means to process notification events

```JavaScript
app.post('/payment/', function (req, res, next) {
    var EmpWebhook = require('node-emerchantpay').WebHook;
    empWebhook = new EmpWebhook({
        secret: 'xxxxxxxxx',
        notifications: {
            'order': function (notification, response) {
                trace.log('processed order: ' + notification.notification_type);
                response.status(200).send('OK');
            }
        }
    })

    return empWebhook(req, res, next);

});
```

## Debugging

### All

```Bash
DEBUG=node-emerchantpay:* node .
```

#### Signer Only

```Bash
DEBUG=node-emerchantpay:signer node .
```

#### Authenticator Only

```Bash
DEBUG=node-emerchantpay:authenticator node .
```

#### Webhook Only

```Bash
DEBUG=node-emerchantpay:webhook node .
```
