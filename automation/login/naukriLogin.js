import {chromium } from 'playwright';
import fs from "fs"

const naukriLogin=async () => {
  const context = await chromium.launchPersistentContext('UserData/naukriUserData', {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

  const page = await context.newPage();
  await page.goto('https://www.naukri.com');

  console.log('Please log in manually...');
  if(page.url().includes("/homepage")){
    await context.close();
    return ({success:true,message:"Logged In"});
  }

  // ✅ Wait until redirected to homepage after login
  await page.waitForURL('**/homepage**', { timeout: 6000000 });
  // ✅ Just in case some cookies are added after homepage load
  await page.waitForTimeout(1000);
  if(page.url().includes("/homepage")){
    await context.close();
    return({success:true,message:"Logged In"});
  }
  else{
    await context.close();
    return({success:false,message:"Not Logged In"});
  }
};
export default naukriLogin;
