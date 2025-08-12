import express from "express";
import cors from "cors";
import { connectDB } from "../backend/config/db.js";
import 'dotenv/config'
import applyJobRouter from "./routes/applyJobsRoute.js";
const app=express();
const port=5000;

app.use(express.json());
app.use(cors({
  origin:"https://smartapply-63cf.onrender.com",
  credentials:true
}));
connectDB();

app.post("/test", (req, res) => {
  res.json({ message: "Test POST working", body: req.body });
});
app.get("/",(req,res)=>{
 res.send("API WORKING")
})
app.use("/apply",applyJobRouter);
app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})