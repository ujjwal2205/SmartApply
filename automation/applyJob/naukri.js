import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import currjobsInfoModel from "../../backend/models/currentJobsModel.js";
import {chromium} from "playwright";
const naukriJobs=async(email)=>{
    const normalizedEmail=email.toLowerCase();
    const context=await chromium.launchPersistentContext('UserData/naukriUserData',{
        headless:false,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await context.newPage();
    try {
        let user=await userInfoModel.findOne({email:normalizedEmail});
        
        await page.goto("https://www.naukri.com");
        await page.locator("//span[@class='nI-gNb-sb__placeholder']").click();
        await page.locator("#jobType").click();
        await page.locator("li[title='Internship'] div span").click();
        await page.locator("input[placeholder='Enter keyword / designation / companies']").fill(user.preferredRole);
        if(user.location){
            await page.locator("input[placeholder='Enter location']").fill(user.location);
        }
        await page.keyboard.press("Enter");
        let pageCounter=0;
        while(pageCounter<=5){
        await page.waitForSelector(".srp-jobtuple-wrapper");
        const jobCards=await page.locator(".srp-jobtuple-wrapper")
        let totalJobs=await jobCards.count();
        let AppliedJobsCount=0;
        console.log(totalJobs);
        let i=0;
        while(AppliedJobsCount<=10 && i<totalJobs){
          const card=jobCards.nth(i);
          let jobTitle=await card.locator("a.title").textContent();
          let preferredRoles=user.preferredRole.toLowerCase().split(" ").map(role=>role.trim());
          let checkJobTitle=jobTitle.toLowerCase();
          let isMatching=preferredRoles.some(role=>checkJobTitle.includes(role));
          const salaryTitle = await card.locator('.sal span').getAttribute('title');
          let minStipend=0;
          if(salaryTitle.toLowerCase().includes("unpaid")){
            minStipend=0;
          }
          else{
            const match = salaryTitle.match(/₹\s*([\d,]+)/);
            if(match){
                minStipend=Number(match[1].replace(/,/g, ""));
            }
          }
          if(!isMatching && minStipend<user.minStipend){
            i++;
            continue;
          }
          let company=await  card.locator("a.comp-name").textContent();
          let portal="Naukri";
          const [newPage]=await Promise.all(
            [
                context.waitForEvent("page"),
                card.click()
            ]
          )
          
          if(await newPage.getByRole("button").nth(1).textContent()==="Apply on company site"){
            await newPage.close();
          }
          else{
              await newPage.locator("#apply-button").nth(0).click();
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
                await newPage.close();
            }
            i++;
        }
        const nextBtn = page.getByRole('link', { name: 'Next' });
        if (await nextBtn.count() > 0) {
        await nextBtn.click();
        pageCounter++;
        } else {
        break; // no more pages
        }
       }
        await context.close();
        return{success:true,message:"Naukri Search Completed"};
    } catch (error) {
        console.log(error);
        return{success:false,message:error.message};
    }
    finally{
        if(context){
            await context.close();
        }
    }
}
export default naukriJobs;