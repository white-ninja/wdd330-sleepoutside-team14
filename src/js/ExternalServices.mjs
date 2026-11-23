import ProductData from './ProductData.mjs';

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

export default class ExternalServices extends ProductData {
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
