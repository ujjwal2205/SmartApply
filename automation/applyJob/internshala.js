import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import {chromium} from "playwright";
const internshalaJobs=async(email)=>{
    const normalizedEmail=email.toLowerCase();
    const context=await chromium.launchPersistentContext('UserData/internshalaUserData',{
        headless:false,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await context.newPage();
    try{
       let user=await userInfoModel.findOne({email:normalizedEmail});
       let appliedJobs=await jobsInfoModel.findOne({email:normalizedEmail});
       await page.goto("https://internshala.com");
       await page.locator("#internships_new_superscript").click();
       await page.waitForSelector("div#select_category_chosen")
        await page.locator("div#select_category_chosen").click();
        await page.locator("div#select_category_chosen input").pressSequentially(user.preferredRoles);
      await page.keyboard.press("Enter");
    if (user.preferredLocations) {
    await page.locator("div#city_sidebar_chosen").click();
    await page.locator("div#city_sidebar_chosen input").pressSequentially(user.preferredLocations);
    await page.keyboard.press("Enter");
    }
       if(user.workFromHome==="Yes"){
        await page.locator("label[for='work_from_home']").click()
       }
       // SCROLL TO LOAD ALL JOBS
    let previousCount = 0;
    let sameCountTries = 0;

    while (true) {
      const cards = await page.locator("div.individual_internship.easy_apply");
      const currentCount = await cards.count();

      if (currentCount === previousCount) {
        sameCountTries++;
        if (sameCountTries >= 3) break; // no more jobs loading
      } else {
        sameCountTries = 0;
      }

      previousCount = currentCount;
      await page.mouse.wheel(0, 3000); // scroll down
      await page.waitForTimeout(1500);
    }
     let totalJobs=await page.locator("div.individual_internship.easy_apply").count();
     let AppliedJobsCount=0;
     console.log(totalJobs);
     let i=0;
     while(AppliedJobsCount<=20 && i<totalJobs){
        if (await page.getByRole("button", { name: "Skip and continue applying" }).isVisible().catch(() => false)) {
  await page.getByRole("button", { name: "Skip and continue applying" }).click({ force: true });
  await page.waitForTimeout(4000); // wait for the modal to fully disappear
}
        if (await page.locator('#easy_apply_modal_close').isVisible().catch(() => false)) {
  await page.locator('#easy_apply_modal_close').click({ force: true });
  await page.waitForTimeout(500); // wait for the modal to fully disappear
}
        if (await page.locator("#easy_apply_modal_close_confirm").isVisible().catch(() => false)) {
    await page.locator("#easy_apply_modal_close_confirm_exit").click({ force: true });
    await page.waitForTimeout(500);
       } 
        await page.waitForSelector("div.individual_internship.easy_apply");
        totalJobs= await page.locator("div.individual_internship.easy_apply").count();
         if(i>=totalJobs){
          i=totalJobs-1;
         }
         const card= page.locator("div.individual_internship.easy_apply").nth(i);
         let jobTitle=await card.locator("#job_title").textContent();
         let companyRaw = await card.locator("p[class$='company-name']").textContent();
         let company = (companyRaw || "").trim(); 
         let portal="Internshala";
         await card.click();
         await page.waitForTimeout(2000);
         await page.getByText("Additional question(s)").waitFor({ timeout: 2000 }).catch(() => {});
         if(await page.getByText("Additional question(s)").isVisible()){
            await page.locator("#easy_apply_modal_close").click();
            await page.waitForTimeout(500);
            await page.locator("#easy_apply_modal_close_confirm_exit").click();
            await page.waitForTimeout(2000);
        }
        else{
            if(await page.locator("//h4[normalize-space()='Cover letter']").isVisible()){
                const coverLetterText=user.whyShouldWeHireYou;
                const editor = page.locator("div.ql-editor[contenteditable='true']");
                await editor.waitFor({ state: "visible", timeout: 5000 });
                await editor.fill(coverLetterText);
            }
            let job={
                jobTitle:jobTitle,
                company:company,
                portal:portal
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
                AppliedJobsCount++;
                await page.locator("#submit").click();
                await page.waitForTimeout(5000);
                console.log(AppliedJobsCount);
            }
            i++;
    }
    await context.close();
        return{success:true,message:"Internshala Search Completed"};
}
    catch(error){
     console.log(error);
     return({success:false,message:error.message});
    }
}
export default internshalaJobs;