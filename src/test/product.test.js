import { describe, expect, it } from '@jest/globals';
import { getImageUrl } from '../js/utils.mjs';

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
