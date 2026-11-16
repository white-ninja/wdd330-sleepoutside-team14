import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, qs } from './utils.mjs';

const category = 'tents';
const dataSource = new ProductData(category);
const productList = new ProductList(category, dataSource, qs('.product-list'));

loadHeaderFooter(import.meta.env.BASE_URL);
productList.init();
