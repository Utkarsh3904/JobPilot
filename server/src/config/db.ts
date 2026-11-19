import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env";

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Ye line sabse upar ho

export const connectDb = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};