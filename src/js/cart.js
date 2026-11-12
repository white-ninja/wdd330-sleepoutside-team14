import { getImageUrl, getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const storedCart = getLocalStorage('so-cart');
  const cartItems = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart]
      : [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  document.querySelectorAll('.cart-card__image img').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        image.replaceWith(document.createTextNode('Image unavailable'));
      },
      { once: true },
    );
  });
  document.querySelectorAll('.cart-card__remove').forEach((button) => {
    button.addEventListener('click', removeCartItem);
  });
}

function removeCartItem(event) {
  const productId = event.currentTarget.dataset.id;
  const storedCart = getLocalStorage('so-cart');
  const cartItems = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart]
      : [];
  const itemIndex = cartItems.findIndex(
    (item) => String(item.Id) === productId,
  );

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage('so-cart', cartItems);
    renderCartContents();
  }
}

function cartItemTemplate(item) {
  const imageUrl = getImageUrl(item.Image, import.meta.env.BASE_URL);
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
  <button class="cart-card__remove" type="button" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">&times;</button>
</li>`;

  return newItem;
}

renderCartContents();
