import {
  loadHeaderFooter,
  alertMessage
} from './utils.mjs';

import CheckoutProcess from './CheckoutProcess.mjs';

// Load the shared website header and footer
loadHeaderFooter(import.meta.env.BASE_URL);

// Initialize checkout
const checkout = new CheckoutProcess(
  'so-cart',
  '.checkout'
);

// Load cart items and display subtotal
checkout.init();

// Get checkout form elements
const zipInput = document.querySelector(
  '#checkout-form [name="zip"]'
);

const form = document.querySelector(
  '#checkout-form'
);

if (zipInput && form) {
  // Calculate totals when ZIP changes
  zipInput.addEventListener('change', () => {
    if (zipInput.value.trim() !== '') {
      checkout.calculateOrderTotal();
    }
  });

  const checkoutButton = form.querySelector(
    'button[type="submit"]'
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    checkoutButton.disabled = true;

    try {
      checkout.calculateOrderTotal();

      await checkout.checkout(form);

    } catch (error) {
      console.error(error);

      let message =
        'We could not place your order.';

      if (error.message) {
        if (typeof error.message === 'object') {
          message =
            error.message.message ||
            JSON.stringify(error.message);
        } else {
          message = error.message;
        }
      }

      alertMessage(message);

    } finally {
      checkoutButton.disabled = false;
    }
  });
}
