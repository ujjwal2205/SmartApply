import { chromium } from "playwright";
const apnaJobsCheck=async()=>{
    const context=await chromium.launchPersistentContext('UserData/apnaJobsUserData',{
        headless:false,
        args:['--disable-blink-features=AutomationControlled']
    })
    const page=await context.newPage();
    await page.goto('https://apna.co/');
    if(await page.getByRole("button",{name:"Candidate Login"}).isVisible().catch(()=>false)){
        await context.close();
        return ({success:false,message:"Not Logged In"});
    }
    else{
        await context.close();
        return ({success:true,message:"Logged In"});
    }
}
export default apnaJobsCheck;