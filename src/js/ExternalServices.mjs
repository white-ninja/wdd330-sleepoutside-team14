import ProductData from './ProductData.mjs';

class ServiceError extends Error {
  constructor(responseBody, status) {
    super(`Checkout failed (${status}): ${JSON.stringify(responseBody)}`);
    this.name = 'servicesError';
    this.responseBody = responseBody;
    this.status = status;
  }
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

    const responseBody = await response.json();
    if (!response.ok) {
      console.error('Backend error details:', responseBody);
      throw {
        name: 'servicesError',
        message: `Checkout failed (${response.status}): ${JSON.stringify(responseBody)}`,
        responseBody,
        status: response.status,
      };
    }

    return responseBody;
  }
}
