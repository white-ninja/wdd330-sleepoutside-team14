import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const addToCartButton = document.getElementById('addToCart');
const productId =
  getParam('product') || (addToCartButton && addToCartButton.dataset.id);
const dataSource = new ProductData('tents');
const product = new ProductDetails(productId, dataSource);
product.init();
