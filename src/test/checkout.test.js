import { afterEach, describe, expect, it, jest } from '@jest/globals';
import ExternalServices from '../js/ExternalServices.mjs';
import CheckoutProcess from '../js/CheckoutProcess.mjs';

const originalDocument = global.document;
const originalLocalStorage = global.localStorage;
const originalWindow = global.window;

afterEach(() => {
  jest.restoreAllMocks();
  if (originalDocument === undefined) {
    delete global.document;
  } else {
    global.document = originalDocument;
  }
  if (originalLocalStorage === undefined) {
    delete global.localStorage;
  } else {
    global.localStorage = originalLocalStorage;
  }
  if (originalWindow === undefined) {
    delete global.window;
  } else {
    global.window = originalWindow;
  }
});

describe('ExternalServices checkout', () => {
  it('uses the original product ID casing for product lookups', async () => {
    const product = { Id: '15KKP' };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ Result: product }),
    });
    const services = new ExternalServices('https://api.example.test');

    await expect(services.findProductById('15KKP')).resolves.toBe(product);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/product/15KKP/',
    );
  });

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

describe('CheckoutProcess totals', () => {
  it('calculates and displays order totals from cart items on initialization', () => {
    const cart = [
      { Id: 'A1', Name: 'Tent', FinalPrice: 100 },
      { Id: 'A2', Name: 'Bag', FinalPrice: 50 },
    ];
    const elements = new Map([
      ['.checkout #subtotal', { textContent: '' }],
      ['.checkout #tax', { textContent: '' }],
      ['.checkout #shipping', { textContent: '' }],
      ['.checkout #orderTotal', { textContent: '' }],
      ['.checkout #checkout-form button[type="submit"]', { disabled: false }],
    ]);
    global.localStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(cart)),
    };
    global.document = {
      querySelector: jest.fn((selector) => elements.get(selector)),
    };

    const checkout = new CheckoutProcess('so-cart', '.checkout', {
      checkout: jest.fn(),
    });
    checkout.init();

    expect(elements.get('.checkout #subtotal').textContent).toBe('$150.00');
    expect(elements.get('.checkout #tax').textContent).toBe('$9.00');
    expect(elements.get('.checkout #shipping').textContent).toBe('$12.00');
    expect(elements.get('.checkout #orderTotal').textContent).toBe('$171.00');
  });

  it('normalizes a legacy single-item cart', () => {
    const elements = new Map([
      ['.checkout #subtotal', { textContent: '' }],
      ['.checkout #tax', { textContent: '' }],
      ['.checkout #shipping', { textContent: '' }],
      ['.checkout #orderTotal', { textContent: '' }],
    ]);
    global.localStorage = {
      getItem: jest
        .fn()
        .mockReturnValue(JSON.stringify({ Id: 'A1', Name: 'Tent', FinalPrice: 100 })),
    };
    global.document = {
      querySelector: jest.fn((selector) => elements.get(selector)),
    };

    const checkout = new CheckoutProcess('so-cart', '.checkout', {
      checkout: jest.fn(),
    });
    checkout.init();

    expect(checkout.list).toHaveLength(1);
    expect(elements.get('.checkout #subtotal').textContent).toBe('$100.00');
    expect(elements.get('.checkout #tax').textContent).toBe('$6.00');
    expect(elements.get('.checkout #shipping').textContent).toBe('$10.00');
    expect(elements.get('.checkout #orderTotal').textContent).toBe('$116.00');
  });

  it('disables submission and announces an empty cart', () => {
    const elements = new Map([
      ['.checkout #subtotal', { textContent: '' }],
      ['.checkout #tax', { textContent: '' }],
      ['.checkout #shipping', { textContent: '' }],
      ['.checkout #orderTotal', { textContent: '' }],
      ['#checkout-form button[type="submit"]', { disabled: false }],
    ]);
    const alertElements = [];
    const main = { prepend: jest.fn() };
    global.localStorage = { getItem: jest.fn().mockReturnValue(null) };
    global.document = {
      querySelector: jest.fn((selector) =>
        selector === 'main' ? main : elements.get(selector),
      ),
      createElement: jest.fn((tagName) => {
        const element = {
          tagName,
          classList: { add: jest.fn() },
          setAttribute: jest.fn(),
          append: jest.fn(),
          addEventListener: jest.fn(),
          remove: jest.fn(),
        };
        alertElements.push(element);
        return element;
      }),
    };
    global.window = { scrollTo: jest.fn() };

    const checkout = new CheckoutProcess('so-cart', '.checkout', {
      checkout: jest.fn(),
    });
    checkout.init();

    expect(
      elements.get('#checkout-form button[type="submit"]').disabled,
    ).toBe(true);
    expect(main.prepend).toHaveBeenCalledWith(alertElements[0]);
  });
});
