import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js"
import userRouter from "./routes/UserRoute.js";
import userRoute from "./routes/PersonalInfoRoute.js";
import jobsRouter from "./routes/AppliedJobsRoute.js";
import 'dotenv/config'
//app config
const app=express();
const port=4000;

//middleware
app.use(express.json())
app.use(cors())
connectDB();
app.get("/",(req,res)=>{
  res.send("API WORKING")
})
app.use("/api/user",userRouter)
app.use("/api",userRoute)
app.use("/api/dashboard",jobsRouter);
app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})