import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const context = await chromium.launchPersistentContext('UserData/internshalaUserData', {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await context.newPage();
  await page.goto('https://www.internshala.com/');

  console.log('Please log in manually...');

  // ✅ Wait for dashboard page after login
  await page.waitForURL('**/dashboard', { timeout: 60000 });

  // ✅ Optional wait for any extra cookies or localStorage updates
  await page.waitForTimeout(1000);

  // ✅ Save session state
  const storage = await context.storageState();
  fs.writeFileSync('./sessions/internshalaSessions.json', JSON.stringify(storage,null,2));  //storage=>konsa data ko string me convert krna hai 
  // null=> koi filter lgana hai??
  // har line me 2 spaces ka gap taaki neat dikhe
  await context.close();
})();
