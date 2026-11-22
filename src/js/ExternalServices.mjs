
const defaultBaseURL = 'https://wdd330-backend-osp8.onrender.com/';

async function convertToJson(response) {
  const jsonResponse = await response.json();

  if (response.ok) {
    return jsonResponse;
  }

  throw {
    name: "servicesError",
    message: jsonResponse,
  };
}


export default class ExternalServices {
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
      throw new Error(`No products found for ${category}.`);
    }

    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(
      `${this.baseURL}product/${encodeURIComponent(id.toLowerCase())}/`,
    );

    const data = await convertToJson(response);

    if (!data.Result) {
      throw new Error(`No product found with ID ${id}.`);
    }

    return data.Result;
  }

  async checkout(order) {
    const response = await fetch(`${this.baseURL}checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend error details:', data);
      throw new Error(
        `Checkout failed (${response.status}): ${JSON.stringify(data)}`,
      );
    }

    return data;
  }
}
