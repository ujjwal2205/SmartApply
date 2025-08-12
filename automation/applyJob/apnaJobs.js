import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import currjobsInfoModel from "../../backend/models/currentJobsModel.js";
import {chromium} from "playwright";
const apnaJobs=async(email)=>{
    const normalizedEmail=email.toLowerCase();
    const context=await chromium.launchPersistentContext('UserData/apnaJobsUserData',{
        headless:true,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await context.newPage();
    try {
        let user=await userInfoModel.findOne({email:normalizedEmail});
        let appliedJobs=await jobsInfoModel.findOne({email:normalizedEmail});
        let dbcurrJob=await currjobsInfoModel.findOne({email:normalizedEmail});
        await page.goto("https://apna.co/");
        await page.locator('input[class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd"]').first().pressSequentially(user.preferredRole);
        await page.waitForTimeout(1000);
        if(user.location){
        await page.locator('input[placeholder="Search for an area or city"]').pressSequentially(user.location);
        await page.waitForTimeout(1000);
        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(1000);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(1000);
        }
        await page.locator('[data-testid="search-button"]').click();
        await page.waitForLoadState('load');
        await page.locator("input[value='wfo']").click();
        if(user.workFromHome==="Yes"){
        await page.locator("input[value='wfh']").click()
       }
       let pageCounter=0;
       let AppliedJobsCount=0;
       while(pageCounter<=10){
           await page.waitForSelector("[data-testid='job-card']");
       const jobCards = page.locator("[data-testid='job-card']").filter({
      has: page.locator("[data-testid='job-card']")
       });
       let totalJobs=await jobCards.count();
       console.log(totalJobs);
       let i=0;
       while(AppliedJobsCount<=20 && i<totalJobs){
           let currJob= jobCards.nth(i);
           let jobTitle=await currJob.locator("[data-testid='job-title']").textContent();
           let companyRaw=await currJob.locator("[data-testid='company-title']").textContent();
           let company=(companyRaw || "").trim();
           let portal="ApnaJobs";
           let job={
            jobTitle:jobTitle,
            company:company,
            portal:portal
            }
            if(await currJob.locator("[data-testid='job-salary']").textContent()==="Not disclosed"){
                
            }
            else{
                const [newPage]=await Promise.all(
                     [
                         context.waitForEvent("page"),
                         currJob.click()
                     ]
                   )
            const applyBtn = newPage.locator("div[class$='w-full cursor-pointer rounded border border-solid bg-[#1F8268] px-[16px] py-[8px] text-center font-semibold text-white']");
await applyBtn.first().waitFor({ state: 'visible' });
await applyBtn.first().click();
            if(await newPage.getByRole("button",{name:"Apply anyway"}).isVisible().catch(() => false)){
             await newPage.getByRole("button",{name:"Apply anyway"}).click();
             await newPage.waitForTimeout(5000);
            }
            if(appliedJobs){
            appliedJobs.jobs.push(job);
            await appliedJobs.save();
            }
            else{
            appliedJobs=new jobsInfoModel({
            email:normalizedEmail,
            jobs:[job]
            })
            await appliedJobs.save();
            }
            if(dbcurrJob){
                dbcurrJob.jobs.push(job);
                await dbcurrJob.save();
            }
            else{
                dbcurrJob=new currjobsInfoModel({
                    email:normalizedEmail,
                    jobs:[job],
                    Expiry:new Date()
                })
                await dbcurrJob.save();
            }
            AppliedJobsCount++;
            console.log(AppliedJobsCount);
            newPage.close();
            }
            i++;
       }
       if(await page.getByRole("button",{name:"Next"}).isVisible().catch(()=>false)){
        await page.getByRole("button",{name:"Next"}).click();
        pageCounter++;
       }
       else{
        break;
       }
    }
        return({success:true,message:"apnaJobs Search Completed"});
    } catch (error) {
        console.log(error);
        return ({success:false,message:error.message});
    }
    finally{
        if(context){
            await context.close();
        }
    }
}
export default apnaJobs;