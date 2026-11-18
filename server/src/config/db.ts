import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ MongoDB connected");
};