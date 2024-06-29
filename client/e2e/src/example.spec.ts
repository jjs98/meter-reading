import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/meters');

  // Expect h1 to contain a substring.
  expect(await page.locator('p').innerText()).toContain('meter-list works!');
});
