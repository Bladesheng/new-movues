import { expect, test } from '@playwright/test';

test.describe('Settings', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/settings');
	});

	test('should save and persist api key', async ({ page }) => {
		await page.getByLabel('New TMDB API key').fill('xxx');
		await page.getByLabel('Save').click();
		await expect(page.getByTestId('currentKey')).toHaveText('xxx');
		await page.reload();
		await expect(page.getByTestId('currentKey')).toHaveText('xxx');
	});
});
