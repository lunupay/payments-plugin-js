const pkg = require('./package.json');
const {
  getPaymentWidgetUrl,
} = require('./index');

const VERSION = `${pkg.name}+${pkg.version}`;

describe('lunu-payment', () => {
  test('getPaymentWidgetUrl | empty options', () => {
    expect(() => {
      getPaymentWidgetUrl();
    }).toThrow();
  });

  test('getPaymentWidgetUrl | empty confirmationToken', () => {
    expect(() => {
      const options = {};
      getPaymentWidgetUrl(options);
    }).toThrow();
  });

  test('getPaymentWidgetUrl | with confirmationToken', () => {
    const url = getPaymentWidgetUrl({
      confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
    });
    // eslint-disable-next-line
    expect(url).toBe('https://widget.lunu.io/alpha/#/?action=select&token=5bd68fb4-70ed-4b0d-b470-b20bc6773f7d&version=' + VERSION);
  });


  test('getPaymentWidgetUrl | with all options', () => {
    const url = getPaymentWidgetUrl({
      confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
      successUrl: 'https://example.com/payment-success',
      cancelUrl: 'https://example.com/payment-cancel',
      enableLunuGift: true,
    });
    // eslint-disable-next-line
    expect(url).toBe('https://widget.lunu.io/alpha/#/?action=select&cancel=https:%2F%2Fexample.com%2Fpayment-cancel&enableLunuGift=true&success=https:%2F%2Fexample.com%2Fpayment-success&token=5bd68fb4-70ed-4b0d-b470-b20bc6773f7d&version=' + VERSION);
  });

  test('getPaymentWidgetUrl | sandbox mode', () => {
    const url = getPaymentWidgetUrl({
      confirmationToken: '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d',
      successUrl: 'https://example.com/payment-success',
      cancelUrl: 'https://example.com/payment-cancel',
      enableLunuGift: false,
      sandbox: true,
    });
    // eslint-disable-next-line
    expect(url).toBe('https://widget.lunu.io/testing/#/?action=select&cancel=https:%2F%2Fexample.com%2Fpayment-cancel&success=https:%2F%2Fexample.com%2Fpayment-success&token=5bd68fb4-70ed-4b0d-b470-b20bc6773f7d&version=' + VERSION);
  });
});
