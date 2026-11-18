import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

        if (!decoded || !decoded.userId) {
            throw new ApiError(401, "Unauthorized: Invalid token");
        }

        req.userId = decoded.userId;
        
        next();
    } catch (err: any) {
        next(new ApiError(401, "Unauthorized: Invalid or expired token"));
    }
};