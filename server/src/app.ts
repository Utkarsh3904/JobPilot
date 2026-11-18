import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { ApiError } from "./utils/ApiError";
import routes from "./routes/index";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;