import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(
      this.productId
    );

    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener(
        "click",
        this.addProductToCart.bind(this)
      );
  }

  addProductToCart() {
    setLocalStorage("so-cart", this.product);
  }

  renderProductDetails() {
    const product = this.product;
    const discount =
  product.ListPrice - product.FinalPrice;

const discountPercent =
  ((discount / product.ListPrice) * 100).toFixed(0);

    document.querySelector(".product-detail").innerHTML = `
      <img src="${product.Image}" alt="${product.Name}">
      <h3>${product.Brand.Name}</h3>
      <h2>${product.Name}</h2>
      <p class="product-price">
  $${product.FinalPrice}
</p>

<p class="discount-badge">
  Save $${discount.toFixed(2)}
  (${discountPercent}% OFF)
</p>
      <p>${product.DescriptionHtmlSimple}</p>
      <button id="addToCart">Add to Cart</button>
    `;
  }
}