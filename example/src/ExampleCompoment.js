const React = require('react');
const noop = require('mn-utils/noop');
const Button = require('@material-ui/core/Button').default;
const CircularProgress = require('@material-ui/core/CircularProgress').default;
const {
  openPaymentWidgetInCurrentWindow,
  openPaymentWidgetInNewWindow,
  goToPaymentWidgetInCurrentWindow,
} = require('lunu-payment');


class ExampleCompoment extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    const setState = self.setState.bind(self);

    let _removeWidget = noop;

    self.state = {};
    self.componentWillUnmount = () => {
      _removeWidget();
    };

    self.render = () => {
      const confirmationToken = '5bd68fb4-70ed-4b0d-b470-b20bc6773f7d';
      const successUrl = window.location.href;
      const cancelUrl = window.location.href;

      const state = self.state;
      const {
        loading,
      } = state;

      return (
        <div {...self.props}>
          <div
            className="f20 fw7 tc mv40"
          >Ways to open Lunu payment widget</div>
          <div className="pv15 rlv">
            <div className={'dn ftBlur4.loading' + (
              loading ? ' loading' : ''
            )}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setState({
                    loading: true,
                  });
                  _removeWidget();
                  _removeWidget = openPaymentWidgetInCurrentWindow({
                    sandbox: true,
                    confirmation_token: confirmationToken,
                    callbacks: {
                      init_error: (error) => {
                        // Handling initialization errors
                      },
                      init_success: () => {
                        // Handling a Successful Initialization
                      },
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
                        setState({
                          loading: false,
                        });
                      },
                    },
                  });
                }}
              >Open Lunu payment widget in current window</Button>
            </div>
            {
              loading ? (
                <div className="abs s layoutRow fhaC fvaC">
                  <CircularProgress
                    className="mhA c0*2"
                  />
                </div>
              ) : null
            }
          </div>
          <div className="pv15">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                openPaymentWidgetInNewWindow({
                  confirmationToken: confirmationToken,
                  successUrl: successUrl,
                  cancelUrl: cancelUrl,
                });
              }}
            >Open Lunu payment widget in new window</Button>
          </div>
          <div className="pv15">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                goToPaymentWidgetInCurrentWindow({
                  confirmationToken: confirmationToken,
                  successUrl: successUrl,
                  cancelUrl: cancelUrl,
                });
              }}
            >Redirect to Lunu payment widget</Button>
          </div>
        </div>
      );
    };
  }
}

module.exports = ExampleCompoment;
