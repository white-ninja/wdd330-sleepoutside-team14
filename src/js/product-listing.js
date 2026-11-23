
import Alert from './Alert.js';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter, qs } from './utils.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);

new Alert(qs('main'), import.meta.env.BASE_URL)
  .init()
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
    new ExternalServices(import.meta.env.VITE_SERVER_URL),
    listElement,
  );

  productList.init();
} else {
  listElement.innerHTML =
    '<li class="product-list__message" role="alert">Choose a product category to see available items.</li>';
}
