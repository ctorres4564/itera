import { test, expect } from '@playwright/test';

test('has title and landing page content', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('h1')).toHaveText('ITERA');
  await expect(page.getByText('Plataforma modular de aprendizagem')).toBeVisible();
  await expect(page.getByText('Primeira fase em preparação')).toBeVisible();
});
