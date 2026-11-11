import tents from '../json/tents.json';
import sleepingBags from '../json/sleeping-bags.json';
import backpacks from '../json/backpacks.json';

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.products = {
      tents,
      'sleeping-bags': sleepingBags,
      backpacks,
    }[category];

    if (!this.products) {
      throw new Error(`Unknown product category: ${category}`);
    }
  }
  getData() {
    return Promise.resolve(this.products);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
