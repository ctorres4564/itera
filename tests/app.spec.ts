import { test, expect } from '@playwright/test';

test('has title and landing page content', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('h1')).toHaveText('ITERA');
  await expect(page.getByText('Python para iniciantes')).toBeVisible();
  await expect(page.getByText('1.1 — print()')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Editor de código' })).toBeVisible();
});
