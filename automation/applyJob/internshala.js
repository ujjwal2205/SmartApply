import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import currjobsInfoModel from "../../backend/models/currentJobsModel.js";
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
       
       await page.goto("https://internshala.com");
       await page.locator("#internships_new_superscript").click();
       await page.waitForSelector("div#select_category_chosen")
        await page.locator("div#select_category_chosen").click();
        await page.locator("div#select_category_chosen input").pressSequentially(user.preferredRole);
      await page.keyboard.press("Enter");
    if (user.location) {
    await page.locator("div#city_sidebar_chosen").click();
    await page.locator("div#city_sidebar_chosen input").pressSequentially(user.location);
    await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(3000);
       if(user.workFromHome==="Yes"){
        await page.locator("label[for='work_from_home']").click()
       }
       await page.waitForTimeout(3000);
       if(user.minStipend>10000){
        await page.locator('#stipend_filter').fill('10000');
       }
       else{
       await page.locator('#stipend_filter').fill(`${user.minStipend}`);
       }
       await page.waitForTimeout(3000);
       // SCROLL TO LOAD ALL JOBS
    let previousCount = 0;
    let sameCountTries = 0;

    while (true) {
      const cards = await page.locator("div.individual_internship");
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
     let totalJobs=await page.locator("div.individual_internship").count();
     let AppliedJobsCount=0;
     console.log(totalJobs);
     let i=0;
     while(AppliedJobsCount<=10 && i<totalJobs){
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
        await page.waitForSelector("div[employment_type='internship']");
        totalJobs= await page.locator("div[employment_type='internship']").count();
         if(i>=totalJobs){
          i=totalJobs-1;
         }
         const card= page.locator("div[employment_type='internship']").nth(i);
         let jobTitle=await card.locator("#job_title").textContent();
         let companyRaw = await card.locator("p[class$='company-name']").textContent();
         let company = (companyRaw || "").trim(); 
         let portal="Internshala";
         const stipendText=await card.locator('.stipend').innerText();
         let minStipend=0;
         if(!stipendText.toLowerCase().includes("unpaid")){
             const match = stipendText.match(/₹\s*([\d,]+)/);
             if (match) {
             minStipend = Number(match[1].replace(/,/g, ""));
             }
             if(minStipend<user.minStipend){
                i++;
                continue;
             }
         }

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
                const coverLetterText=user.whyHire;
                const editor = page.locator("div.ql-editor[contenteditable='true']");
                await editor.waitFor({ state: "visible", timeout: 5000 });
                await editor.fill(coverLetterText);
            }
            if(await page.locator("button[class='frame-close'] i[class='ic-24-cross']").isVisible()){
               await page.locator("button[class='frame-close'] i[class='ic-24-cross']").click();
            }
            const fileInput=page.locator("input[type='file']");
            await fileInput.setInputFiles({
                name:user.resume.name,
                mimeType:user.resume.contentType,
                buffer:user.resume.data
            })
            let job={
                jobTitle:jobTitle,
                company:company,
                portal:portal,
                appliedDate:new Date()
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
    finally{
        if(context){
            await context.close();
        }
    }
}
export default internshalaJobs;