import { test, expect } from '@playwright/test';

test('has branding', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  const header = page.locator("//clr-header//span[@cds-text='headline']");
  expect(await header.innerText()).toContain('JJSware');
});
