import { expect, test } from '@playwright/test';
import { configDotenv } from 'dotenv';

configDotenv();

test.describe('Movies', () => {
	test.beforeEach(async ({ page }) => {
		const token = process.env.TMDB_ACCESS_TOKEN;
		await page.addInitScript((value) => {
			window.localStorage.setItem('tmdbAccessToken', value);
		}, token);

		await page.goto('/movies');
	});

	test('should load some movies posters', async ({ page }) => {
		await page.waitForFunction(() => {
			// load at least 5 movies
			return document.querySelectorAll('[data-testid="posterCard"]').length >= 5;
		});
	});

	test('should filter based on popularity and movie age', async ({ page }) => {
		await page.getByLabel('Minimal popularity').fill('20');
		await page.getByLabel('Max. movie age (days)').fill('5');
		await page.getByLabel('Max. movie age (days)').press('Enter');

		const firstMoviePoster = page.getByTestId('posterCard').first();
		await expect(firstMoviePoster).toContainText('5 days ago');
		const popularity = await firstMoviePoster.getByTitle('Popularity').textContent();
		expect(parseInt(popularity)).toBeGreaterThanOrEqual(20);
	});

	test('released movies should have rating', async ({ page }) => {
		await page.getByLabel('Max. movie age (days)').fill('30');
		await page.getByRole('button', { name: 'Popularity' }).click();

		const firstMoviePoster = page.getByTestId('posterCard').first();
		const rating = await firstMoviePoster.getByTitle('Rating').textContent();
		expect(parseFloat(rating)).toBeGreaterThanOrEqual(0.1);
	});

	test('should sort movies by popularity', async ({ page }) => {
		await page.getByRole('button', { name: 'Popularity' }).click();
		const firstRating = await page.getByTestId('posterCard').first().textContent();
		const secondRating = await page.getByTestId('posterCard').nth(1).textContent();
		expect(parseInt(firstRating)).toBeGreaterThan(parseInt(secondRating));
	});

	test('should load more movies after scrolling to bottom', async ({ page }) => {
		await page.getByLabel('Minimal popularity').fill('10');
		await page.getByLabel('Minimal popularity').press('Enter');
		await page.waitForLoadState('networkidle');
		const originalCount = await page.getByTestId('posterCard').count();

		await page.getByTestId('loadingSpinner').scrollIntoViewIfNeeded();
		// give infinite loader time to catch up
		await page.waitForTimeout(1000);
		await page.waitForLoadState('networkidle');
		const newCount = await page.getByTestId('posterCard').count();

		expect(newCount).toBeGreaterThan(originalCount);
	});
});
