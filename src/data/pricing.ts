/**
 * What a subscription costs, in one place.
 *
 * The price used to be written out wherever it happened to be needed.
 * That is how the checkout came to charge twenty-five dollars a month
 * while the confirmation email still promised seventy-five a quarter.
 * Anything that quotes a price should import it from here.
 */

export const SUBSCRIPTION_PRICE = {
  /** On a button, or anywhere tight: "$25". */
  amount: '$25',
  /** In a sentence: "$25 a month". */
  perMonth: '$25 a month',
  /** Set small beside `amount`: "/month". */
  unit: '/month',
} as const;
