const pkg = require('./package.json');
const noop = require('mn-utils/noop');
const isString = require('mn-utils/isString');
const eachTry = require('mn-utils/eachTry');
const param = require('mn-utils/param');
const executeTry = require('mn-utils/executeTry');
const script = require('mn-utils/browser/script');


function loadPaymentWidgetProvider(configs) {
  const widgetVersion = configs.version || 'alpha';
  const scriptUrl = 'https://plugins.lunu.io/packages/widget-ui/' + widgetVersion + '.js?t=' + 1 * new Date();
  let loading;
  let lib = window.Lunu;
  let watchers = [];

  return (callback) => {
    function cancel() {
      callback = 0;
    }
    if (lib) {
      executeTry(callback, [lib], lib);
      return cancel;
    }
    watchers.push(function() {
      // eslint-disable-next-line
      callback && callback.apply(this, arguments);
    });
    if (loading) return cancel;
    loading = true;
    script(scriptUrl).then(() => {
      loading = false;
      lib = window.Lunu;
      const ws = watchers;
      watchers = [];
      eachTry(ws, [lib], lib);
    });
    return cancel;
  };
}

const loadPaymentWidgetSandbox = loadPaymentWidgetProvider({
  version: 'testing',
});
const loadPaymentWidget = loadPaymentWidgetProvider({
  version: 'alpha',
});

function openPaymentWidgetInCurrentWindow(options) {
  let _remove = noop;
  const cancel = (options.sandbox ? loadPaymentWidgetSandbox : loadPaymentWidget)((lib) => {
    _remove = lib.API.openWidget(options).remove;
  });
  return () => {
    cancel();
    _remove();
  };
}

function getPaymentWidgetUrl(options) {
  const confirmationToken = options && options.confirmationToken;
  if (!confirmationToken) {
    throw new Error('The confirmation token is empty');
  }
  if (!isString(confirmationToken)) {
    throw new Error('The confirmation token must be a string');
  }
  return 'https://widget.lunu.io/' + (options.sandbox ? 'testing' : 'alpha') + '/#/?' + param({
    action: 'select',
    token: options.confirmationToken,
    success: options.successUrl,
    cancel: options.cancelUrl,
    enableLunuGift: options.enableLunuGift || null,
    version: `${pkg.name} ${pkg.version}`,
  });
}

function goToPaymentWidgetInCurrentWindow(options) {
  window.location.href = getPaymentWidgetUrl(options);
}
function openPaymentWidgetInNewWindow(options) {
  window.open(getPaymentWidgetUrl(options));
}

module.exports = {
  loadPaymentWidgetProvider,
  getPaymentWidgetUrl,
  loadPaymentWidget,
  loadPaymentWidgetSandbox,
  openPaymentWidgetInCurrentWindow,
  openPaymentWidgetInNewWindow,
  goToPaymentWidgetInCurrentWindow,
};
