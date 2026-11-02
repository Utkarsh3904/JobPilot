import dotenv from "dotenv";
dotenv.config(); // Side-effect import ki jagah direct call karo
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  CLIENT_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1); // App start hi nahi hogi
}

export const env = _env.data;