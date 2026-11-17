import Alert from './Alert.js';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter, qs } from './utils.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);
new Alert(qs('main'), import.meta.env.BASE_URL)
  .init()
  // Surface JSON or network failures without blocking the product list.
  // eslint-disable-next-line no-console
  .catch((error) => console.error('Unable to load alerts:', error));

const categoryLabels = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};
const category = getParam('category');
const listElement = qs('.product-list');

if (Object.prototype.hasOwnProperty.call(categoryLabels, category)) {
  document.getElementById('product-list-title').textContent =
    `Top Products: ${categoryLabels[category]}`;
  const productList = new ProductList(
    category,
    new ProductData(import.meta.env.VITE_SERVER_URL),
    listElement,
  );
  productList.init();
} else {
  listElement.innerHTML =
    '<li class="product-list__message" role="alert">Choose a product category to see available items.</li>';
}
