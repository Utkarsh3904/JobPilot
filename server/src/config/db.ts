import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // DB connect nahi hua toh app band ho jaye
  }
};