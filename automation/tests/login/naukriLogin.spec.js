import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120000);

test('Login to Naukri.com', async () => {
  const context = await chromium.launchPersistentContext('./UserData/naukriUserData', {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

  const page = await context.newPage();
  await page.goto('https://www.naukri.com');

  console.log('Please log in manually...');

  // ✅ Wait until redirected to homepage after login
  await page.waitForURL('**/homepage**', { timeout: 60000 });

  // ✅ Just in case some cookies are added after homepage load
  await page.waitForTimeout(1000);

  // ✅ Save session state
  await context.storageState({ path: './sessions/naukriSessions.json' });

  await context.close();
});
