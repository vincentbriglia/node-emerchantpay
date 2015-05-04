

## Usage

```JavaScript
app.get('/payment/', function (req, res) {

    var Eps = require('emerchantpay-paramsigner');

    var ps = new Eps();

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

## Debugging

```Bash
DEBUG=emerchantpay-paramsigner node .
```