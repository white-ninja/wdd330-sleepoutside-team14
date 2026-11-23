
import { loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);

const dataSource = new ExternalServices(
  import.meta.env.VITE_SERVER_URL,
);

const element = document.querySelector('.product-list');

const listing = new ProductList('tents', dataSource, element);

listing.init();
