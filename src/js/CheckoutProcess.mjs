import { alertMessage, getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function formDataToJSON(formElement) {
  return Object.fromEntries(new FormData(formElement).entries());
}

function normalizeCart(storedCart) {
  if (Array.isArray(storedCart)) {
    return storedCart;
  }
  return storedCart ? [storedCart] : [];
}

export default class CheckoutProcess {
  constructor(key, outputSelector, externalServices = new ExternalServices()) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = externalServices;
  }

  init() {
    this.list = normalizeCart(getLocalStorage(this.key));
    this.calculateItemSubTotal();
    if (this.list.length === 0) {
      const submitButton = document.querySelector(
        '#checkout-form button[type="submit"]',
      );
      if (!submitButton) {
        throw new Error('The checkout page is missing its submit button.');
      }
      submitButton.disabled = true;
      alertMessage('Your cart is empty. Add an item before checking out.');
    }
  }

  calculateItemSubTotal() {
    this.itemTotal = Number(
      this.list
        .reduce((sum, item) => sum + Number(item.FinalPrice), 0)
        .toFixed(2),
    );
    document.querySelector(`${this.outputSelector} #subtotal`).textContent =
      `$${this.itemTotal.toFixed(2)}`;
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    this.tax = Number((this.itemTotal * 0.06).toFixed(2));
    this.shipping = this.list.length
      ? 10 + (this.list.length - 1) * 2
      : 0;
    this.orderTotal = Number(
      (this.itemTotal + this.tax + this.shipping).toFixed(2),
    );
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #orderTotal`).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems() {
    return this.list.map((item) => ({
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

    const response = await this.externalServices.checkout(order);
    localStorage.removeItem(this.key);
    window.location.href = new URL('success.html', window.location.href).href;
    return response;
  }
}
