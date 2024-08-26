import { expect, test } from '@playwright/test';
import { configDotenv } from 'dotenv';

configDotenv();

test.describe('Home', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should have title', async ({ page }) => {
		await expect(page).toHaveTitle(/MoVues/);
	});

	test('should get to tv show details', async ({ page }) => {
		await page.getByTitle('Settings').click();
		await page.getByLabel('New TMDB API key').fill(process.env.TMDB_ACCESS_TOKEN);
		await page.getByLabel('Save').click();

		await page.getByText('TV Shows').click();
		await page.getByRole('button', { name: 'Popularity' }).click();
		await page.getByLabel('Max. show age (days)').fill('30');
		await page.getByLabel('Max. show age (days)').press('Enter');
		const firstMoviePoster = page.getByTestId('posterCard').first();
		const firstMovieTitle = await firstMoviePoster.getByLabel('title name').textContent();

		await firstMoviePoster.click();
		await expect(page.getByText(firstMovieTitle)).toBeVisible();
	});
});
