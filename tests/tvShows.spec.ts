import { expect, test } from '@playwright/test';
import { configDotenv } from 'dotenv';

configDotenv();

test.describe('Movies', () => {
	test.beforeEach(async ({ page }) => {
		const token = process.env.TMDB_ACCESS_TOKEN;
		await page.addInitScript((value) => {
			window.localStorage.setItem('tmdbAccessToken', value);
		}, token);

		await page.goto('/tv');
	});

	test('should load some tv shows posters', async ({ page }) => {
		await page.waitForFunction(() => {
			// load at least 5 movies
			return document.querySelectorAll('[data-testid="posterCard"]').length >= 5;
		});
	});
});
