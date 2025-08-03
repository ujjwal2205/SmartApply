import userInfoModel from "../../backend/models/PersonalInfoModel.js";
import jobsInfoModel from "../../backend/models/AppliedJobsModel.js";
import {chromium} from "playwright";
import { link } from "fs";
const linkedInJobs=async(email)=>{
    const normalizedEmail=email.toLowerCase();
    const context=await chromium.launchPersistentContext('UserData/linkedInUserData',{
        headless:false,
        args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await context.newPage();
    try {
        let user=await userInfoModel.findOne({email:normalizedEmail});
        let appliedJobs=await jobsInfoModel.findOne({email:normalizedEmail});
        await page.goto("https://www.linkedin.com");
        await page.waitForLoadState('load');
        await page.locator("//a[contains(@href,'https://www.linkedin.com/jobs/?')]").click();
        await page.locator('input[aria-label="Search by title, skill, or company"]').first().fill(`${user.preferredRoles} ${user.preferredLocations}, India`);
        await page.keyboard.press("Enter");
        await page.locator("#searchFilter_applyWithLinkedin").click();
    } catch (error) {
        console.log(error);
        return ({success:false,message:error.message});
    }
}
export default linkedInJobs