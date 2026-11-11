import { getImageUrl, getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    const addToCartButton = document.getElementById('addToCart');
    if (!addToCartButton) {
      throw new Error('The product page is missing its Add to Cart button.');
    }
    addToCartButton.disabled = true;

    if (!this.productId) {
      this.renderUnavailableProduct('No product was selected.');
      return;
    }

    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      this.renderUnavailableProduct('The selected product could not be found.');
      return;
    }

    this.renderProductDetails();
    addToCartButton.addEventListener('click', this.addToCart.bind(this));
    addToCartButton.disabled = false;
  }

  addToCart() {
    const storedCart = getLocalStorage('so-cart');
    const cart = Array.isArray(storedCart)
      ? storedCart
      : storedCart
        ? [storedCart]
        : [];
    cart.push({
      ...this.product,
      Image: getImageUrl(this.product.Image),
    });
    setLocalStorage('so-cart', cart);
  }

  renderProductDetails() {
    const brand = document.getElementById('productBrand');
    if (!brand) {
      return;
    }

    brand.textContent = this.product.Brand.Name;
    document.getElementById('productName').textContent =
      this.product.NameWithoutBrand;

    const image = document.getElementById('productImage');
    const imageUrl = getImageUrl(this.product.Image);
    if (imageUrl) {
      image.src = imageUrl;
    } else {
      image.removeAttribute('src');
    }
    image.alt = imageUrl ? this.product.Name : '';
    image.hidden = !imageUrl;

    document.getElementById('productFinalPrice').textContent =
      `$${this.product.FinalPrice}`;
    document.getElementById('productColorName').textContent =
      this.product.Colors[0].ColorName;
    document.getElementById('productDescriptionHtmlSimple').innerHTML =
      this.product.DescriptionHtmlSimple;
    document.title = `Sleep Outside | ${this.product.Name}`;
  }

  renderUnavailableProduct(message) {
    const productDetails = document.querySelector('.product-detail');
    if (!productDetails) {
      throw new Error(
        'The product page is missing its product detail section.',
      );
    }

    productDetails.replaceChildren();
    const notice = document.createElement('p');
    notice.setAttribute('role', 'alert');
    notice.textContent = message;
    productDetails.append(notice);
  }
}
