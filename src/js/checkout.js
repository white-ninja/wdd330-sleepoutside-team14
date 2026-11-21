
import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load the shared website header and footer
loadHeaderFooter(import.meta.env.BASE_URL);

// Initialize checkout
const checkout = new CheckoutProcess('so-cart', '.checkout');

// Load cart items and display subtotal
checkout.init();

// Get checkout form elements
const zipInput = document.querySelector('#checkout-form [name="zip"]');
const form = document.querySelector('#checkout-form');

if (zipInput && form) {
  // Calculate totals when the ZIP code changes
  zipInput.addEventListener('change', () => {
    if (zipInput.value.trim() !== '') {
      checkout.calculateOrderTotal();
    }
  });

  // Handle checkout submission
  const checkoutButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    checkoutButton.disabled = true;

    try {
      checkout.calculateOrderTotal();
      await checkout.checkout(form);

      alert('Your order was placed successfully!');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('We could not place your order. Please try again.');
    } finally {
      checkoutButton.disabled = false;
    }
  });
}
