const defaultBaseURL = 'https://wdd330-backend-osp8.onrender.com/';

function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`Unable to load ${response.url}: ${response.status}`);
  }
  return response.json();
}

export default class ProductData {
  constructor(baseURL = defaultBaseURL) {
    const apiURL = baseURL || defaultBaseURL;
    this.baseURL = apiURL.endsWith('/') ? apiURL : `${apiURL}/`;
  }

  async getData(category) {
    const response = await fetch(
      `${this.baseURL}products/search/${encodeURIComponent(category)}`,
    );
    const data = await convertToJson(response);
    if (!Array.isArray(data.Result)) {
      throw new Error(`The product search for ${category} returned no results.`);
    }
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(
      `${this.baseURL}product/${encodeURIComponent(id.toLowerCase())}/`,
    );
    const data = await convertToJson(response);
    if (!data.Result) {
      throw new Error(`The product lookup for ${id} returned no product.`);
    }
    return data.Result;
  }
}
