import { expect, test } from '@playwright/test';
import { configDotenv } from 'dotenv';

configDotenv();

test.describe('Movie details', () => {
	test.beforeEach(async ({ page }) => {
		const token = process.env.TMDB_ACCESS_TOKEN;
		await page.addInitScript((value) => {
			window.localStorage.setItem('tmdbAccessToken', value);
		}, token);

		await page.goto('/movies/129');
	});

	test('should get data from TMDB', async ({ page }) => {
		await expect(page.getByText('Spirited Away')).toBeVisible();
		await expect(page.getByText('Hayao Miyazaki')).toBeVisible();
		await expect(page.getByText('Rumi Hiiragi')).toBeVisible();
		await expect(page.getByText('bath house')).toBeVisible();
		await expect(page.getByTitle('Genre').first()).toContainText('Animation');
		await expect(page.getByTitle('Release date')).toContainText('2001');
		const tmdbRating = await page.getByTitle('TMDB rating').textContent();
		expect(parseInt(tmdbRating)).toBeGreaterThan(80);
	});

	test('should get data from CSFD and open new tab', async ({ page }) => {
		const csfdRating = await page.getByTitle('CSFD rating').textContent();
		expect(parseInt(csfdRating)).toBeGreaterThan(80);

		const newTabPromise = page.waitForEvent('popup');
		await page.getByAltText('csfd logo').click();
		const newTab = await newTabPromise;
		await expect(newTab).toHaveTitle(/Cesta do fantazie/);
	});

	test('should open new tab with IMDB', async ({ page }) => {
		const newTabPromise = page.waitForEvent('popup');
		await page.getByAltText('imdb logo').click();
		const newTab = await newTabPromise;
		await expect(newTab).toHaveTitle(/Spirited Away/);
	});
});
