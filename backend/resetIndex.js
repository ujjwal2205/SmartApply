import mongoose from "mongoose";
import currjobsInfoModel from "./models/currentJobsModel.js";
import 'dotenv/config'
const run = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);

  try {
    await currjobsInfoModel.collection.dropIndex("Expiry_1");
    console.log("Old TTL index removed.");
  } catch (err) {
    console.log("Index not found or already removed:", err.message);
  }

  await mongoose.disconnect();
};

run();
