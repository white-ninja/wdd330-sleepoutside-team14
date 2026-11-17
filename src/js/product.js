import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ProductData(import.meta.env.VITE_SERVER_URL);
const product = new ProductDetails(productId, dataSource);

loadHeaderFooter(import.meta.env.BASE_URL);
product.init();
