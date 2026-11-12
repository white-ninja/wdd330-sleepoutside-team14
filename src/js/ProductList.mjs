import { getImageUrl, renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const imageUrl = getImageUrl(product.Image, import.meta.env.BASE_URL);
  const fallbackImageUrl = getImageUrl(
    '/images/noun_Tent_2517.svg',
    import.meta.env.BASE_URL,
  );
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imageUrl || fallbackImageUrl}" alt="${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData();
    this.renderList(products);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );

    this.listElement.querySelectorAll('img').forEach((image) => {
      image.addEventListener(
        'error',
        () => {
          image.src = getImageUrl(
            '/images/noun_Tent_2517.svg',
            import.meta.env.BASE_URL,
          );
          image.alt = 'Tent';
        },
        { once: true },
      );
    });
  }
}
