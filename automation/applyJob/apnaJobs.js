import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import currjobsInfoModel from "../../backend/models/currentJobsModel.js";
import {chromium} from "playwright";
const apnaJobs=async(email)=>{
    const roleMap = {
  "Frontend Development": [
    "frontend", "front end", "react", "angular", "vue",
    "javascript", "html", "css", "ui developer", "web developer","software developer"
  ],

  "Back end Development": [
    "backend", "back end", "node", "express", "api",
    "java", "spring", "django", "flask", "server","software developer"
  ],

  "Full Stack Development": [
    "full stack", "mern", "mean",
    "react", "node", "express", "mongodb",
    "frontend", "backend", "web developer", "software engineer","software developer"
  ],

  "Software Development": [
    "software engineer", "software developer", "sde",
    "programmer", "developer", "application developer"
  ],

  "Data Analyst": [
    "data analyst", "sql", "excel", "power bi",
    "tableau", "data analysis", "analytics"
  ],

  "Data Science": [
    "data scientist", "machine learning", "deep learning",
    "python", "nlp", "statistics"
  ],

  "Machine Learning": [
    "machine learning", "ml engineer", "deep learning",
    "tensorflow", "pytorch", "ai engineer"
  ],

  "Android App Development": [
    "android", "kotlin", "java",
    "android developer", "mobile developer"
  ],

  "iOS App Development": [
    "ios", "swift", "objective c",
    "ios developer", "mobile developer"
  ],

  "DevOps Engineer": [
    "devops", "docker", "kubernetes", "ci/cd",
    "jenkins", "aws", "azure"
  ],

  "UI/UX Design": [
    "ui", "ux", "figma", "adobe xd",
    "design", "user experience"
  ],

  "Cloud Computing": [
    "cloud", "aws", "azure", "gcp",
    "cloud engineer", "cloud architect"
  ],

  "Software Testing": [
    "qa", "testing", "automation testing",
    "manual testing", "selenium"
  ],

  "Product Management": [
    "product manager", "product management",
    "roadmap", "product owner"
  ],

  "Business Development": [
    "business development", "sales", "marketing",
    "lead generation"
  ],

  "Blockchain Development": [
    "blockchain", "web3", "solidity",
    "ethereum", "smart contract"
  ],

  "Game Development": [
    "game developer", "unity", "unreal",
    "game design"
  ],

  "Cyber Security": [
    "cyber security", "security", "ethical hacking",
    "penetration testing", "infosec"
  ]
};
const isRelevantKeyword = (jobTitle, preferredRole) => {
  if (!jobTitle || !preferredRole) return false;
  const title = jobTitle.toLowerCase();
  
  
  const keywords = roleMap[preferredRole] || preferredRole.split(" ");
  
  let matchCount = 0;
  
  for (let keyword of keywords) {
      if (title.includes(keyword)) {
          matchCount++;
        }
    }
    
    console.log(`Portal:${jobTitle}` +`PreferredRole:${preferredRole}` +`MatchCount:${matchCount}`);
  return matchCount>=1;
};
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
            if(salaryText!=="Not disclosed" && user.minStipend<=minValue && isRelevantKeyword(jobTitle,user.preferredRole)){
                const [newPage]=await Promise.all(
                     [
                         context.waitForEvent("page"),
                         currJob.click()
                     ]
                   )
            const applyBtn = newPage.locator("div.flex-1 button:has-text('Apply for job')").or(newPage.locator("div.flex-1 button:has-text('Register for walk in')"));
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