import {chromium } from 'playwright';
import fs from "fs"

( async () => {
  const context = await chromium.launchPersistentContext('UserData/naukriUserData', {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

  const page = await context.newPage();
  await page.goto('https://www.naukri.com');

  console.log('Please log in manually...');

  // ✅ Wait until redirected to homepage after login
  await page.waitForURL('**/homepage**', { timeout: 6000000 });

  // ✅ Just in case some cookies are added after homepage load
  await page.waitForTimeout(1000);

  // ✅ Save session state
   const storage=await context.storageState();
   fs.writeFileSync('./sessions/naukriSessions.json', JSON.stringify(storage,null,2));

  await context.close();
})();
