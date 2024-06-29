import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/meter');

  // Expect h1 to contain a substring.
  expect(await page.locator('p').innerText()).toContain('meter works!');
});
