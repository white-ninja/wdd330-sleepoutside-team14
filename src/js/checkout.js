import { alertMessage, loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);

const checkout = new CheckoutProcess('so-cart', '.checkout');
checkout.init();

const form = document.querySelector('#checkout-form');
const checkoutButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    return;
  }

  checkoutButton.disabled = true;
  try {
    await checkout.checkout(form);
  } catch (error) {
    // Keep diagnostic details in the browser console for failed orders.
    // eslint-disable-next-line no-console
    console.error('Unable to complete checkout:', error);
    const message =
      error instanceof Error
        ? error.message
        : error?.message?.message || JSON.stringify(error);
    alertMessage(message);
    checkoutButton.disabled = false;
  }
});
