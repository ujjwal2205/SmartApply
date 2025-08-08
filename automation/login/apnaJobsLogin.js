import {chromium} from 'playwright';
import fs from 'fs';
const apnaJobsLogin= async () => {
  const context = await chromium.launchPersistentContext('UserData/apnaJobsUserData', {
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

  const page = await context.newPage();
  await page.goto('https://apna.co/');

  console.log('Please log in manually...');
    if(await page.locator("div[class='ml-auto flex justify-end w-[288px]'] div[class='UserAvatar__ProfileContainer-sc-1s3h4os-6 ghpGTR']").isVisible().catch(()=>false)){
       await context.close();
       return ({success:true,message:"Logged In"});   
    }
    else{
      // ✅ Wait until redirected to homepage after login
       await page.waitForURL('**/candidate/**', { timeout: 60000 });
      // ✅ Just in case some cookies are added after homepage load
      await page.waitForTimeout(1000);
      if(page.url().includes("/candidate")){
        await context.close();
        return ({success:true,message:"Logged In"});
      }
      else{
        await context.close();
        return({success:false,message:"Not Logged In"});
      }
    }
};
export default apnaJobsLogin;
