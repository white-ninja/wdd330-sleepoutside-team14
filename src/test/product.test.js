import { afterEach, describe, expect, it, jest } from '@jest/globals';
import {
	getImageUrl,
	loadTemplate,
	renderWithTemplate,
} from '../js/utils.mjs';
import ProductData from '../js/ProductData.mjs';
import ProductDetails from '../js/ProductDetails.mjs';

const originalDocument = global.document;

afterEach(() => {
	jest.restoreAllMocks();
	if (originalDocument === undefined) {
		delete global.document;
	} else {
		global.document = originalDocument;
	}
});

describe('getImageUrl', () => {
	it('converts source-relative image paths to public image paths', () => {
		expect(getImageUrl('../images/tents/example.jpg')).toBe(
			'/images/tents/example.jpg',
		);
	});

	it('includes the deployment base path for public images', () => {
		expect(
			getImageUrl('../images/tents/example.jpg', '/wdd330-sleepoutside-team14/'),
		).toBe('/wdd330-sleepoutside-team14/images/tents/example.jpg');
	});

	it('leaves other image paths unchanged', () => {
		expect(getImageUrl('/images/tents/example.jpg')).toBe(
			'/images/tents/example.jpg',
		);
	});

	it('returns null for invalid image paths', () => {
		expect(getImageUrl(null)).toBeNull();
		expect(getImageUrl('')).toBeNull();
	});
});

describe('shared templates', () => {
	it('renders a template and invokes its callback with data', () => {
		const parentElement = { innerHTML: '' };
		const data = { page: 'home' };
		const callback = jest.fn();

		renderWithTemplate('<p>Shared content</p>', parentElement, data, callback);

		expect(parentElement.innerHTML).toBe('<p>Shared content</p>');
		expect(callback).toHaveBeenCalledWith(data);
	});

	it('loads template text and reports failed requests', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		fetchMock.mockResolvedValueOnce({
			ok: true,
			text: async () => '<footer>Shared footer</footer>',
		});
		await expect(loadTemplate('/partials/footer.html')).resolves.toBe(
			'<footer>Shared footer</footer>',
		);

		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 404,
			statusText: 'Not Found',
		});
		await expect(loadTemplate('/partials/missing.html')).rejects.toThrow(
			'404 Not Found',
		);
	});
});

describe('ProductData API', () => {
	it('loads products for the requested category from the API result', async () => {
		const products = [{ Id: '20CXG' }];
		jest.spyOn(global, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ Result: products }),
		});
		const dataSource = new ProductData('https://api.example.test');

		await expect(dataSource.getData('sleeping-bags')).resolves.toBe(products);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.example.test/products/search/sleeping-bags',
		);
	});

	it('preserves product ID casing when fetching and reports an empty API result', async () => {
		const product = { Id: '20CXG' };
		const fetchMock = jest.spyOn(global, 'fetch');
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ Result: product }),
		});
		const dataSource = new ProductData('https://api.example.test/');

		await expect(dataSource.findProductById('20CXG')).resolves.toBe(product);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.example.test/product/20CXG/',
		);

		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ Result: null }),
		});
		await expect(dataSource.findProductById('unknown')).rejects.toThrow(
			'returned no product',
		);
	});
});

describe('ProductDetails', () => {
	it('renders product data returned by the case-preserving lookup', async () => {
		const product = {
			Id: '15KKP',
			Name: 'Kelty Sleeping Bag',
			NameWithoutBrand: 'Sleeping Bag',
			Brand: { Name: 'Kelty' },
			Images: { PrimaryLarge: 'https://example.test/product.jpg' },
			FinalPrice: 99.99,
			Colors: [{ ColorName: 'Blue' }],
			DescriptionHtmlSimple: 'Warm and lightweight.',
		};
		const elements = new Map([
			['addToCart', { addEventListener: jest.fn(), disabled: false }],
			['productBrand', { textContent: '' }],
			['productName', { textContent: '' }],
			[
				'productImage',
				{
					addEventListener: jest.fn(),
					removeAttribute: jest.fn(),
					hidden: false,
				},
			],
			['productFinalPrice', { textContent: '' }],
			['productColorName', { textContent: '' }],
			['productDescriptionHtmlSimple', { innerHTML: '' }],
		]);
		global.document = {
			title: '',
			getElementById: jest.fn((id) => elements.get(id)),
		};
		const dataSource = {
			findProductById: jest.fn().mockResolvedValue(product),
		};

		await new ProductDetails('15KKP', dataSource).init();

		expect(dataSource.findProductById).toHaveBeenCalledWith('15KKP');
		expect(elements.get('productBrand').textContent).toBe('Kelty');
		expect(elements.get('productName').textContent).toBe('Sleeping Bag');
		expect(elements.get('productFinalPrice').textContent).toBe('$99.99');
		expect(elements.get('productColorName').textContent).toBe('Blue');
		expect(elements.get('productDescriptionHtmlSimple').innerHTML).toBe(
			'Warm and lightweight.',
		);
		expect(elements.get('productImage').src).toBe(
			'https://example.test/product.jpg',
		);
		expect(elements.get('addToCart').disabled).toBe(false);
	});
});
