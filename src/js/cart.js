import { getImageUrl, getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const storedCart = getLocalStorage('so-cart');
  const cartItems = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart]
      : [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const imageUrl = getImageUrl(item.Image);
  const imageContent = imageUrl
    ? `<img src="${imageUrl}" alt="${item.Name}" />`
    : '<span>Image unavailable</span>';
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    ${imageContent}
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
