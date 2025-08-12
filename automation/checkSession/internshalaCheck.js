import { chromium } from "playwright";
const internshalaCheck=async()=>{
    const context = await chromium.launchPersistentContext('UserData/internshalaUserData', {
  headless: true,  
  args:['--disable-blink-features=AutomationControlled']
});
    const page=await context.newPage();
    await page.goto('https://www.internshala.com');
    const url=await page.url();
    if(url.includes("dashboard")){
        await context.close();
        return ({success:true,message:"Logged In"});
    }
    else{
        await context.close();
        return ({success:false,message:"Not Logged In"});
    }
}
export default internshalaCheck;