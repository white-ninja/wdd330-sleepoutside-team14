import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const addToCartButton = document.getElementById('addToCart');
const productId =
  getParam('product') || (addToCartButton && addToCartButton.dataset.id);
const dataSource = new ProductData('tents');
const product = new ProductDetails(productId, dataSource);

loadHeaderFooter(import.meta.env.BASE_URL);
product.init();
