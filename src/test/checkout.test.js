import { afterEach, describe, expect, it, jest } from '@jest/globals';
import ExternalServices from '../js/ExternalServices.mjs';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ExternalServices checkout', () => {
  it('sends the order and returns the parsed success response', async () => {
    const result = { orderId: 'test-order' };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => result,
    });
    const services = new ExternalServices('https://api.example.test');

    await expect(services.checkout({ fname: 'Ada' })).resolves.toBe(result);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/checkout',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fname: 'Ada' }),
      }),
    );
  });

  it('keeps structured response details on a failed checkout error', async () => {
    const responseBody = { message: 'The card was declined.' };
    const json = jest.fn().mockResolvedValue(responseBody);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json,
    });
    const services = new ExternalServices('https://api.example.test/');

    await expect(services.checkout({})).rejects.toMatchObject({
      name: 'servicesError',
      message: `Checkout failed (400): ${JSON.stringify(responseBody)}`,
      responseBody,
      status: 400,
    });
    expect(json).toHaveBeenCalledTimes(1);
  });
});
