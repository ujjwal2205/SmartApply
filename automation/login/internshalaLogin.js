import { chromium } from 'playwright';
const internshalaLogin=async () => { 
  try{
  const context = await chromium.launchPersistentContext('UserData/internshalaUserData', {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await context.newPage();
  await page.goto('https://www.internshala.com/');
  await page.waitForLoadState('load');
  
  
  if(page.url().includes("/dashboard")){
    
    await context.close();
    return ({success:true,message:"Logged In"});
  }
 
       await page.waitForURL('**/dashboard', { timeout: 60000 });
  
      if (page.url().includes("/dashboard")) {
   
        await context.close();
        return { success: true, message: "Logged In" };
      }
      else{

        await context.close();
        return { success: false, message: "Timeout waiting for login" };
      }
  }
  catch(error){
     console.log(error);
  return({success:false,message:error.message});
  }
    } 
  
export default internshalaLogin;
