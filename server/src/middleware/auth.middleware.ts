import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // 1. Cookie se token (VIP ticket) nikaalo
    const token = req.cookies.token;
    
    // 2. Agar token nahi hai (bina ticket ka aadmi)
    if (!token) {
        return next(new ApiError(401, "Not logged in"));
    }

    try {
        // 3. Ticket ko check karo (asli hai ya fake?)
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        
        // 4. User ki ID request me daal do, taaki aage kaam aaye
        req.userId = decoded.userId;
        
        // 5. Sab sahi hai, aage bhej do (route tak)
        next();
    } catch (error) {
        // Agar ticket expired ya fake hai
        return next(new ApiError(401, "Invalid or expired token"));
    }
}