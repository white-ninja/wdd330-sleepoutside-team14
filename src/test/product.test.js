import { afterEach, describe, expect, it, jest } from '@jest/globals';
import {
	getImageUrl,
	loadTemplate,
	renderWithTemplate,
} from '../js/utils.mjs';

afterEach(() => {
	jest.restoreAllMocks();
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
