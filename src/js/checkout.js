import CheckoutProcess from './CheckoutProcess.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter(import.meta.env.BASE_URL);

const checkout = new CheckoutProcess(
  'so-cart',
  import.meta.env.BASE_URL,
  import.meta.env.VITE_SERVER_URL,
);
checkout.init();
