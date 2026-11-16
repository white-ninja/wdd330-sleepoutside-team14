import ShoppingCart from './ShoppingCart.mjs';
import { loadHeaderFooter, qs } from './utils.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);

const shoppingCart = new ShoppingCart('so-cart', qs('.product-list'));
shoppingCart.init();
