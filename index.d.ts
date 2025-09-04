import {
  cancel,
  fn,
} from "mn-utils/global";

export type LunuLib = any;
export type onLunuLoadCallback = (lunuLib?: LunuLib) => any;

export interface IPayment {
  id: string;
  status: string;
  amount: string;
  currency: string;
  description: string;
  confirmation_token: string;
  created_at: string;
  expires: string;
}

export interface IWidgetCallbacks {
  // Handling a successful payment event
  payment_paid?: (payment: IPayment) => any;

  // Handling a payment cancellation event
  payment_cancel?: fn;

  // Handling the event of closing the widget window
  payment_close?: fn;
}

export interface IWidgetOptions {
  // sandbox mode
  sandbox?: boolean;

  confirmationToken: string;

  successUrl?: string;
  cancelUrl?: string;
  enableLunuGift?: boolean;
}

export type loadPaymentWidgetFn = (callback?: onLunuLoadCallback) => cancel;

export declare const loadPaymentWidgetProvider: (configs: {
  version?: string, // Widget version
}) => loadPaymentWidgetFn;

export declare const openPaymentWidgetInCurrentWindow: (options: {
  // sandbox mode
  sandbox?: boolean;

  /*
    Token that must be received from the Processing Service before making a payment
    Required parameter
  */
  confirmation_token: string;

  callbacks?: IWidgetCallbacks;
}) => cancel;


export declare const getPaymentWidgetUrl: (options: IWidgetOptions) => string;
export declare const goToPaymentWidgetInCurrentWindow: (options: IWidgetOptions) => void;
export declare const openPaymentWidgetInNewWindow: (options: IWidgetOptions) => void;
