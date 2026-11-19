import { Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { 
    getGoogleLoginUrl, 
    loginWithGoogleCode, 
    signToken, 
    getUserById 
} from "../services/auth.service";

// Cookie ka danda (rules) - HttpOnly matlab JS se nahi padhi ja sakti (secure)
const cookieOptions = { 
    httpOnly: true, 
    secure: env.NODE_ENV === "production", 
    sameSite: "lax" as const 
};

// 1. User jab Google login button dabata hai
export const googleLogin = catchAsync(async (req: Request, res: Response) => {
    // Ek random code banao (taaki koi hacker beech me na aaye - CSRF protection)
    const state = randomBytes(16).toString("hex");

    // Us code ko cookie me save karo (1 ghante ke liye)
    res.cookie("oauth_state", state, { ...cookieOptions, maxAge: 60 * 60 * 1000 });
    
    // User ko Google ke login page pe bhej do
    res.redirect(getGoogleLoginUrl(state));
});

// 2. User jab Google se login karke wapas aata hai (Callback)
export const googleCallback = catchAsync(async (req: Request, res: Response) => {
    // Agar user ne Google pe "Cancel" dabaya
    if (req.query.error) {
        return res.redirect(`${env.CLIENT_URL}/login?error=denied`);
    }

    const code = String(req.query.code);
    const state = String(req.query.state);

    // Check karo ki state wahi hai jo humne bheji thi (Security)
    if (state !== req.cookies.oauth_state) {
        throw new ApiError(400, "Invalid OAuth state");
    }

    // Service ko bulao: "Code check karo aur user nikaal lao"
    const user = await loginWithGoogleCode(code);
    
    // User ki ID se ek JWT (Ticket) banao
    const token = signToken(String(user._id));

    // Kaam khatam, ab state cookie delete kar do
    res.clearCookie("oauth_state", cookieOptions);

    // Main JWT (Ticket) cookie me save karo (7 din ke liye)
    res.cookie("token", token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // User ko wapas frontend (React) pe bhej do
    res.redirect(env.CLIENT_URL);
});

// 3. Frontend jab puche "Main kaun hu?" (Profile nikalne ke liye)
export const getMe = catchAsync(async (req: Request, res: Response) => {
    // req.userId! ka matlab: Middleware ne pehle hi check kar liya hai ki user logged in hai
    const user = await getUserById(req.userId!); 
    
    // User ka data bhej do
    res.json({ success: true, data: user });
});

// 4. User jab Logout kare
export const logout = (req: Request, res: Response) => {
    // Ticket (cookie) ko delete kar do
    res.clearCookie("token", cookieOptions);
    res.json({ success: true, message: "Logged out successfully" });
};