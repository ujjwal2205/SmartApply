import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import currjobsInfoModel from "../../backend/models/currentJobsModel.js";
import {chromium} from "playwright";
const apnaJobs=async(email)=>{
    const normalizedEmail=email.toLowerCase();
    const context=await chromium.launchPersistentContext('UserData/apnaJobsUserData',{
        headless:false,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await context.newPage();
    try {
        let user=await userInfoModel.findOne({email:normalizedEmail});
        
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
       await page.waitForTimeout(2000);
const normalizeStipend = (value) => {
  if (value < 10000) return 0;
  return Math.floor(value / 10000) * 10000;
};

const target = normalizeStipend(user.minStipend);

const slider = page.locator('[aria-valuemax="150000"]');
await slider.waitFor({ state: "visible" });

const sliderTrack = slider.locator('xpath=ancestor::span[contains(@class,"MuiSlider-root")]');

await sliderTrack.scrollIntoViewIfNeeded();

const box = await sliderTrack.boundingBox();

const max = 150000;

const percent = target / max;
const targetX = box.x + box.width * percent;
const centerY = box.y + box.height / 2;
await page.mouse.click(targetX, centerY);
await page.waitForTimeout(1000);

let newValue = Number(await slider.getAttribute("aria-valuenow"));
if (Math.abs(newValue - target) > 2000) {
  let tries = 0;

  while (Math.abs(newValue - target) > 2000 && tries < 5) {
    await page.mouse.click(targetX, centerY);
    await page.waitForTimeout(800);
    newValue = Number(await slider.getAttribute("aria-valuenow"));
    tries++;
  }
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
            portal:portal,
            appliedDate:new Date()
            }
            
            const salaryText=await currJob.locator("[data-testid='job-salary']").textContent();
            const minStipend=salaryText.match(/₹\s*([\d,]+)/);
            let minValue=0;
            if(minStipend){
                minValue = Number(minStipend[1].replace(/,/g, ""));
            }
            if(salaryText!=="Not disclosed" && user.minStipend<=minValue){
                const [newPage]=await Promise.all(
                     [
                         context.waitForEvent("page"),
                         currJob.click()
                     ]
                   )
            const applyBtn = newPage.locator("div.flex-1 button:has-text('Apply for job')");
            await applyBtn.click();
            if(await newPage.getByRole("button",{name:"Apply anyway"}).isVisible().catch(() => false)){
             await newPage.getByRole("button",{name:"Apply anyway"}).click();
             await newPage.waitForTimeout(5000);
            }
           await jobsInfoModel.findOneAndUpdate(
                         { email: normalizedEmail },
                           {
                               $setOnInsert: {
                               email: normalizedEmail,
                               },
                              $addToSet: { jobs: job }
                           },
                           { upsert: true }
                           );
                           await currjobsInfoModel.findOneAndUpdate(
                          { email: normalizedEmail },
                          {
                          $setOnInsert: {
                          email: normalizedEmail,
                          Expiry: new Date()
                         },
                          $addToSet: { jobs: job }
                         },
                          { upsert: true }
                           );
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