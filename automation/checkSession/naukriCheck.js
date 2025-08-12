import { chromium } from "playwright";
const naukriCheck=async()=>{
    const context=await chromium.launchPersistentContext('UserData/naukriUserData',{
        headless:true,
        args:['--disable-blink-features=AutomationControlled']
    })
    const page=await context.newPage();
    await page.goto('https://www.naukri.com');
    const url=await page.url();
    if(url.includes("homepage")){
        await context.close();
        return ({success:true,message:"Logged In"});
    }
    else{
        await context.close();
        return ({success:false,message:"Not Logged In"});
    }
}
export default naukriCheck;