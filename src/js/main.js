import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { qs } from './utils.mjs';

const category = 'tents';
const dataSource = new ProductData(category);
const productList = new ProductList(category, dataSource, qs('.product-list'));

productList.init();
