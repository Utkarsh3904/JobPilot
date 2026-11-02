import { Request, Response, NextFunction } from "express";

// Ek custom type bana rahe hain jo Express ke async function ko represent karta hai
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // fn ko execute karo, aur agar promise reject hua, toh error ko next() mein daal do
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};    