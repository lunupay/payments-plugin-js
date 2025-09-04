# Lunu Payment Widget. JS Library


## API credentials

You can get your credentials in your account on the console.lunu.io website
in the section https://console.lunu.io/developer-options


For debugging, you can use the following credentials:  

  - sandbox mode:
    - App Id: 8ce43c7a-2143-467c-b8b5-fa748c598ddd
    - API Secret: f1819284-031e-42ad-8832-87c0f1145696

  - production mode:
    - App Id: a63127be-6440-9ecd-8baf-c7d08e379dab
    - API Secret: 25615105-7be2-4c25-9b4b-2f50e86e2311



## Install

```sh
npm i lunu-payment --save
```

## Examples

```js
const {
  getPaymentWidgetUrl,
  openPaymentWidgetInCurrentWindow,
  openPaymentWidgetInNewWindow,
  goToPaymentWidgetInCurrentWindow,
} = require('lunu-payment');

```

### Getting a link to the payment page.

```js
const {
  getPaymentWidgetUrl,
} = require('lunu-payment');

const paymentPageUrl = getPaymentWidgetUrl({
  /*
    Token that must be received from the Processing Service before making a payment
    Required parameter
  */
  confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',

  // link to checkout success page
  successUrl: 'https://example.com/payment-success',

  // link to payment cancel page
  cancelUrl: 'https://example.com/payment-cancel',

  // sandbox mode
  sandbox: false,
});
/*
=>
https://widget.lunu.io/alpha/#/?action=select&cancel=https:%2F%2Fexample.com%2Fpayment-cancel&enableLunuGift=0&success=https:%2F%2Fexample.com%2Fpayment-success&token=5bd68fb4-70ed-4b0d-b470-b20bc6773f7d
*/
```


### Sandbox mode

If sandbox mode is enabled, the endpoint ``` testing.lunu.io ``` is used.  
You can use there a test-net cryptocurrency.  
To debug payment with this server, reconfigure the Lunu Wallet to test mode.


If sandbox mode is disabled, the endpoint ``` alpha.lunu.io ``` is used.  


### Open the widget in the current window on top of other elements.

```js
const {
  openPaymentWidgetInCurrentWindow,
} = require('lunu-payment');


const removeWidget = openPaymentWidgetInCurrentWindow({
  // sandbox mode
  sandbox: false,

  /*
    Token that must be received from the Processing Service before making a payment
    Required parameter
  */
  confirmation_token: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',

  callbacks: {
    payment_paid: (paymentInfo) => {
      // Handling a successful payment event
      // window.location.href = successUrl;
    },
    payment_cancel: () => {
      // Handling a payment cancellation event
      // window.location.href = cancelUrl;
    },
    payment_close: () => {
      // Handling the event of closing the widget window
    }
  },
});

// Cancel the opening of the widget or remove the widget if it is already open.
removeWidget();

```


### Open the payment page in a new window.

```js
const {
  openPaymentWidgetInNewWindow,
} = require('lunu-payment');


openPaymentWidgetInNewWindow({
  confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
  successUrl: 'https://example.com/payment-success',
  cancelUrl: 'https://example.com/payment-cancel',
});

```


### Go to the payment page in the current window.

```js
const {
  goToPaymentWidgetInCurrentWindow,
} = require('lunu-payment');


goToPaymentWidgetInCurrentWindow({
  confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
  successUrl: 'https://example.com/payment-success',
  cancelUrl: 'https://example.com/payment-cancel',
});

```



## Lunu Payment API. General information.

URL pattern:
```
https://{testing|alpha}.lunu.io/api/v1/<method>
```

API endpoints:

  * alpha.lunu.io - production server
  * testing.lunu.io - server for product debugging in the sandbox, you can use there a test-net cryptocurrency.
  To debug payment with this server, reconfigure the Lunu Wallet to test mode


The API is available for authorized users.
Unauthorized users receive an empty response and status
```
404 Not found
```

All responses are returned in JSON format.

The responses from the server are wrapped:

  * a successful response is returned in the response field:
```
{
   "response": {...}
}
```

  * if it is necessary to return an error, then the error is returned in the error field, for example:

```
{
   "error": {
     "code": 1,
     "message": "..."
   }
}
```

### Authentication

HTTP Basic Auth must be used to authenticate requests.
For the request headers, you must enter the merchant ID as the username, and the secret key as the password.

Example header:
```
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
```
where QWxhZGRpbjpPcGVuU2VzYW1l is the result of the function: base64(app_id + ':' + secret_key)


### Idempotency

From the API's point of view, idempotency means that multiple requests are handled in the same way as single requests.  
It means that upon receiving a repeated request with the same parameters, the Processing Service will return the result of the original request in response.  
This approach helps to avoid the unwanted replay of transactions. For example, if during a payment there are network problems and the connection is interrupted, you can safely repeat the required request as many times as you need.  
GET requests are idempotent by default, since they have no unwanted consequences.  
To ensure the idempotency of POST requests, the Idempotence-Key header (or idempotence key) is used.

Example header:
```
Idempotence-Key: 3134353
```
where 3134353 is the result of the function: uniqid()

The idempotency key needs to be unique within the individual application ID of the account.  
One application ID cannot be used in several stores, otherwise it may not be sufficient to use only the store's internal order number as the idempotency key, since these values may be repeated in requests from other stores with the same application ID.



### Scenario for making a payment through the Widget

When the user proceeds to checkout (this can be either a single product or a basket of products),
the payment process goes through the following stages:



#### 1. Payment creation. payments/create

The merchant's website or application sends a request to the **Processing Service** to create a payment, which looks like this:
```
POST https://alpha.lunu.io/api/v1/payments/create
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
Idempotence-Key: 3134353
Content-Type: application/json
```
```json
{
  "email": "customer@example.com",
  "shop_order_id": "208843-42-23-842",
  "amount": "100.00",
  "amount_of_shipping": "15.00",
  "callback_url": "https://website.com/api/change-status",
  "description": "Order #208843-42-23-842",
  "expires": "2020-02-22T00:00:00-00:00"
}
```


Description of fields:

  * email (string) (optional parameter) - customer email; used when a refund is required;  

  * shop_order_id (string) (optional parameter) - shop order id;  

  * amount (string) - payment amount (currency is indicated in the merchant's profile);  

  * amount_of_shipping (string) (optional parameter) - amount of shipping;  

  * callback_url (string) (optional parameter) - url-address of the store's callback API,
    to which the **Processing service** will send a request when the payment status changes (when the payment is made)

  * description (string) (optional parameter) - if you need to add a description of the payment
    that the seller wants to see in its personal account, then you need to pass the description parameter.
    The description should be no more than 128 characters.

  * expires (string) (optional parameter) - date when the payment expires, in RFC3339 format. By default: 1 minute from the moment of sending;


The **Processing Service** returns the created payment object with a token for initializing the widget.
```json
{
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "status": "pending",
  "amount": "100.00",
  "currency": "EUR",
  "description": "Order #208843-42-23-842",
  "confirmation_token": "ct-24301ae5-000f-5000-9000-13f5f1c2f8e0",
  "created_at": "2019-01-22T14:30:45-03:00",
  "expires": "2020-02-22T00:00:00-00:00"
}
```

Description of fields:

  * id (string) - payment ID;

  * status (string) - payment status. Value options:  

    * "pending" - awaiting payment;  
    * "awaiting_payment_confirmation" - the transaction was found in the mempool, it is awaiting confirmation in the blockchain network;
    * "paid" - payment has been made;  
    * "canceled" - the payment was canceled by the seller;  
    * "expired" - the time allotted for the payment has expired;  

  * amount (string)- amount of payment;

  * currency (string) - payment currency;

  * description (string) - payment description, no more than 128 characters;

  * confirmation_token (string) - payment token, which is required to initialize the widget;

  * created_at (string) - the date the payment was created;

  * expires (string) - the date when the payment expires, in RFC3339 format.



#### 2. Initialize the widget.

```js
const {
  openPaymentWidgetInNewWindow,
} = require('lunu-payment');


openPaymentWidgetInNewWindow({
  confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
  successUrl: 'https://example.com/payment-success',
  cancelUrl: 'https://example.com/payment-cancel',
});

```


#### 3. Notifying the seller's store about a change in payment status. Payment Callback

When the user has made a payment, the **Processing Service** sends a request in the
following format to the store's API url, which was specified at the time of creating the payment:

```
POST https://website.com/api/change-status
```
```json
{
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "shop_order_id": "208843-42-23-842",
  "status": "paid",
  "amount": "100.00",
  "currency": "EUR",
  "description": "Order #208843-42-23-842",
  "created_at": "2019-01-22T14:30:45-03:00",
  "expires": "2020-02-22T00:00:00-00:00"
}
```

Description of fields:

  * id (string) - payment ID;

  * status (string) - payment status. Value options:

    * "awaiting_payment_confirmation" - the transaction was found in the mempool, it is awaiting confirmation in the blockchain network;
    * "paid" - payment has been made;  
    * "canceled" - the payment was canceled by the seller;  
    * "expired" - the time allotted for the payment has expired;  


  * shop_order_id (string) (optional parameter) - shop order id;  

  * amount (string)- amount of payment;

  * currency (string) - payment currency;

  * description (string) - payment description, no more than 128 characters;

  * created_at (string) - the date the payment was created;

  * expires (string) - the date when the payment expires, in RFC3339 format.




#### 4. The store checks the validity of the notification received. payments/get/{payment_id}

After the merchant has received a notification about the change in the payment status,
he needs to check the validity of this notification through the **Processing Service**
by the following request:
```
POST https://alpha.lunu.io/api/v1/payments/get/{payment_id}
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
```

If everything is good then the **Processing Service** returns an identical payment object:
```
{
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "status": "paid",
  "shop_order_id": "208843-42-23-842",
  "amount": "100.00",
  "currency": "EUR",
  "description": "Order #208843-42-23-842",
  "created_at": "2019-01-22T14:30:45-03:00",
  "expires": "2020-02-22T00:00:00-00:00"
}
```


## Refunds API

Example of creating a refund:

```
POST https://alpha.lunu.io/api/v1/refund/create
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
Idempotence-Key: ps_refund_1614589640890_3134
Content-Type: application/json
```
```json
{
  "payment_id": "23d93cac-000f-5000-8000-126628f15141",
  "value_fiat": "50.5",
  "email": "customer_email@example.com"
}
```

Description of fields:
* payment_id (string) - payment ID;
* value_fiat (string) - refund amount in fiat;  
* email (string) - customer email; A link will be sent to this address for the refund procedure.


Response if successful:
```
{
  "response": {
    "purpose": "R-1254-1",
    "iban": "GB29NWBK60161331926819",
    "fiat_amount": "21.00",
    "amount_too_big": false
  }
}
```
Description of fields:
* purpose (string) - payment purpose (R-{order number}-{refund number}, for example R-1254-1);
* iban (string) - IBAN;
* value_fiat (string) - refund amount in fiat;
* amount_too_big (boolean) - a flag signaling that the return has been partially executed from the amount that was set in the parameters. The flag is true when the refund amount for the payment exceeds the payment amount.


Response if failure:
```
{
  "error": {
    "code": 404,
    "message": "Payment not found"
  }
}
```
