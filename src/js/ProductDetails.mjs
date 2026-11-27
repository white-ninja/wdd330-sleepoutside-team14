import {
  alertMessage,
  getLocalStorage,
  setLocalStorage,
} from './utils.mjs';

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

    try {
      this.product = await this.dataSource.findProductById(this.productId);
    } catch (error) {
      console.error('Unable to load product details:', error);
      this.renderUnavailableProduct(
        'Product details could not be loaded. Please try again later.',
      );
      return;
    }
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
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    alertMessage(`${this.product.Name} was added to your cart.`, false);
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
    const images = this.product.Images || {};

    const imageUrl =
      images.PrimaryLarge ||
      images.PrimaryMedium ||
      images.PrimaryExtraLarge ||
      images.PrimarySmall;

    const responsiveImages = [
      [images.PrimarySmall, 80],
      [images.PrimaryMedium, 160],
      [images.PrimaryLarge, 320],
      [images.PrimaryExtraLarge, 600],
    ];

    image.srcset = responsiveImages
      .filter(([url]) => url)
      .map(([url, width]) => `${url} ${width}w`)
      .join(', ');

    image.sizes = '(max-width: 500px) 90vw, 468px';
    image.addEventListener(
      'error',
      () => {
        image.hidden = true;
      },
      { once: true },
    );
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
