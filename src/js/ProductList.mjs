import { getImageUrl, renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const images = product.Images || {};

  const imageUrl =
    images.PrimaryMedium ||
    images.PrimarySmall ||
    images.PrimaryLarge ||
    images.PrimaryExtraLarge;

  const responsiveImages = [
    [images.PrimarySmall, 80],
    [images.PrimaryMedium, 160],
    [images.PrimaryLarge, 320],
    [images.PrimaryExtraLarge, 600],
  ]
    .filter(([url]) => url)
    .map(([url, width]) => `${url} ${width}w`)
    .join(', ');

  const fallbackImageUrl = getImageUrl(
    '/images/noun_Tent_2517.svg',
    import.meta.env.BASE_URL,
  );

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${encodeURIComponent(product.Id)}">
      <img
        src="${imageUrl || fallbackImageUrl}"
        srcset="${responsiveImages}"
        sizes="(max-width: 500px) 45vw, 250px"
        alt="${product.Name}"
      />
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
    try {
      const products = await this.dataSource.getData(this.category);
      this.renderList(products);
    } catch (error) {
      console.error('Unable to load products:', error);
      this.listElement.innerHTML =
        '<li class="product-list__message" role="alert">Products could not be loaded. Please try again later.</li>';
    }
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
          image.removeAttribute('srcset');
          image.removeAttribute('sizes');
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