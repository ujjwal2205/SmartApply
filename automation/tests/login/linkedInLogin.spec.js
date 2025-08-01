import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120000);

test('Login to linkedIn.com', async () => {
  const context = await chromium.launchPersistentContext('./UserData/linkedInUserData', {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

  const page = await context.newPage();
  await page.goto('https://www.linkedin.com/');

  console.log('Please log in manually...');

  // ✅ Wait until redirected to homepage after login
   await page.waitForFunction(() => {
  return window.location.href.includes('/feed');
}, { timeout: 60000 });


  // ✅ Just in case some cookies are added after homepage load
  await page.waitForTimeout(1000);

  // ✅ Save session state
  await context.storageState({ path: './sessions/linkedInSessions.json' });

  await context.close();
});
