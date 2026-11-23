import { alertMessage, getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function formDataToJSON(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

export default class CheckoutProcess {
  constructor(
    storageKey,
    baseUrl = '/',
    serverUrl = 'https://wdd330-backend-osp8.onrender.com/',
  ) {
    this.storageKey = storageKey;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    this.externalServices = new ExternalServices(serverUrl);
    this.items = [];
    this.itemTotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    const storedCart = getLocalStorage(this.storageKey);
    this.items = Array.isArray(storedCart)
      ? storedCart
      : storedCart
        ? [storedCart]
        : [];

    this.itemTotal = Number(
      this.items
        .reduce((total, item) => total + Number(item.FinalPrice), 0)
        .toFixed(2),
    );
    this.tax = Number((this.itemTotal * 0.06).toFixed(2));
    this.shipping = this.items.length ? 10 + (this.items.length - 1) * 2 : 0;
    this.orderTotal = Number(
      (this.itemTotal + this.tax + this.shipping).toFixed(2),
    );
    this.renderTotals();

    const form = document.getElementById('checkout-form');
    const submitButton = form.querySelector('button[type="submit"]');
    if (this.items.length === 0) {
      submitButton.disabled = true;
      alertMessage('Your cart is empty. Add an item before checking out.');
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitButton.disabled = true;
      const completed = await this.checkout(form);
      if (!completed) {
        submitButton.disabled = false;
      }
    });
  }

  renderTotals() {
    document.getElementById('subtotal').textContent =
      `$${this.itemTotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${this.tax.toFixed(2)}`;
    document.getElementById('shipping').textContent =
      `$${this.shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems() {
    return this.items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    }));
  }

  async checkout(form) {
    const order = {
      ...formDataToJSON(form),
      orderDate: new Date().toISOString(),
      items: this.packageItems(),
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax,
    };

    try {
      await this.externalServices.checkout(order);
      localStorage.removeItem(this.storageKey);
      window.location.href = `${this.baseUrl}checkout/success.html`;
      return true;
    } catch (error) {
      console.error('Unable to complete checkout:', error);
      alertMessage(
        error instanceof Error
          ? error.message
          : `Checkout failed: ${JSON.stringify(error)}`,
      );
      return false;
    }
  }
}
