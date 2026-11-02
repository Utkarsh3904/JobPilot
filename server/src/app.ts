import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS (Frontend ko allow karne ke liye, with cookies)
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // Cookies ke liye zaroori hai
  })
);

// 3. Request Logger (Morgan) - Terminal mein API calls dikhayega
app.use(morgan("dev"));

// 4. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// 6. Routes (Baad mein add karenge jab files banengi)
// import authRoutes from "./features/auth/auth.routes";
// app.use("/api/auth", authRoutes);

// 7. Global Error Handler (Sabse last mein)
app.use(errorHandler);

export default app;