
import { getParam, loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');

const dataSource = new ExternalServices(
  import.meta.env.VITE_SERVER_URL,
);

const product = new ProductDetails(productId, dataSource);

loadHeaderFooter(import.meta.env.BASE_URL);

product.init();
