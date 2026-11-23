const defaultBaseURL = 'https://wdd330-backend-osp8.onrender.com/';

class ServiceError extends Error {
  constructor(responseBody, status) {
    super(`Checkout failed (${status}): ${JSON.stringify(responseBody)}`);
    this.name = 'servicesError';
    this.responseBody = responseBody;
    this.status = status;
  }
}

async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw new ServiceError(jsonResponse, response.status);
  }
  return jsonResponse;
}

export default class ExternalServices {
  constructor(baseURL = defaultBaseURL) {
    const apiURL = baseURL || defaultBaseURL;
    this.baseURL = apiURL.endsWith('/') ? apiURL : `${apiURL}/`;
  }

  async checkout(order) {
    const response = await fetch(`${this.baseURL}checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    return convertToJson(response);
  }
}
