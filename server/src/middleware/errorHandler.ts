import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Agar hamari custom ApiError hai
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose duplicate key error (e.g. same email se dobara login)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Default 500 Error
  console.error("💥 Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};