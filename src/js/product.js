import { getLocalStorage, setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  const storedCart = getLocalStorage('so-cart');
  const cart = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart]
      : [];
  cart.push(product);
  setLocalStorage('so-cart', cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const productId = e.currentTarget.dataset.id;
  const product = await dataSource.findProductById(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
