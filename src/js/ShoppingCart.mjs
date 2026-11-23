import {
  getImageUrl,
  getLocalStorage,
  renderListWithTemplate,
  setLocalStorage,
} from './utils.mjs';

function cartItemTemplate(item) {
  const imageUrl =
    item.Images?.PrimaryMedium ||
    getImageUrl(item.Image, import.meta.env.BASE_URL);
  const productUrl = `../product_pages/index.html?product=${encodeURIComponent(item.Id)}`;
  const imageContent = imageUrl
    ? `<img src="${imageUrl}" alt="${item.Name}" />`
    : '<span>Image unavailable</span>';

  return `<li class="cart-card divider">
  <a href="${productUrl}" class="cart-card__image">
    ${imageContent}
  </a>
  <a href="${productUrl}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">&times;</button>
</li>`;
}

export default class ShoppingCart {
  constructor(storageKey, listElement) {
    this.storageKey = storageKey;
    this.listElement = listElement;
    this.handleRemove = this.handleRemove.bind(this);
  }

  init() {
    this.listElement.addEventListener('click', this.handleRemove);
    this.renderContents();
  }

  renderContents() {
    const storedCart = getLocalStorage(this.storageKey);
    const cartItems = Array.isArray(storedCart)
      ? storedCart
      : storedCart
        ? [storedCart]
        : [];
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      cartItems,
      'afterbegin',
      true,
    );
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice),
      0,
    );
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
      cartTotal.textContent = total.toFixed(2);
    }

    this.listElement
      .querySelectorAll('.cart-card__image img')
      .forEach((image) => {
        image.addEventListener(
          'error',
          () => {
            image.replaceWith(document.createTextNode('Image unavailable'));
          },
          { once: true },
        );
      });
  }

  handleRemove(event) {
    const button = event.target.closest('.cart-card__remove');
    if (!button || !this.listElement.contains(button)) {
      return;
    }

    const storedCart = getLocalStorage(this.storageKey);
    const cartItems = Array.isArray(storedCart)
      ? storedCart
      : storedCart
        ? [storedCart]
        : [];
    const itemIndex = cartItems.findIndex(
      (item) => String(item.Id) === button.dataset.id,
    );

    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      setLocalStorage(this.storageKey, cartItems);
      this.renderContents();
    }
  }
}
