import currjobsInfoModel from "../models/currentJobsModel.js";
import nodemailer from "nodemailer";
const currentJobs=async(req,res)=>{
    try {
        const normalizedEmail=req.body.email.toLowerCase();
        const user=await currjobsInfoModel.findOne({email:normalizedEmail});
        if(!user){
            return res.json({success:false,message:"No jobs found"});
        }
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}
        })
        const  jobListHtml=user.jobs.map((job)=>`
        <li>
            <strong>${job.jobTitle}</strong> at <strong>${job.company}</strong>
            Portal: <em>${job.portal}</em>
        </li>`
        ).join("")
        await transporter.sendMail({
            to:req.body.email,
            subject:"Your Job Application has been Submitted",
            html:`<div>
            <h2>Thank You for Applying!</h2>
            <p>You have successfully applied to the following job(s) through <strong>SmartApply</strong>:</p>
            <ul>
            ${jobListHtml}
           </ul>
           <p>We’ve forwarded your applications successfully. Best of luck on your job hunt!</p>
           <p>If you have any questions, feel free to reply to this email.</p>
           </div>`
        })
        res.json({success:true,message:`Email has been sent to ${req.body.email}`});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default currentJobs;