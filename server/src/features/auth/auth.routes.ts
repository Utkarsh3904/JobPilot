import express from 'express';
import { google } from 'googleapis'; // Sahi import
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../users/user.model';
import { requireAuth } from './auth.middleware';

const router = express.Router();

// Google OAuth Client Setup
const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);

// 1. Login Route: User ko Google par bhejna
router.get('/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Refresh token ke liye zaroori hai
        prompt: 'consent', // Har baar refresh token de (testing ke liye acha hai)
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/gmail.readonly' // Gmail padhne ke liye (Phase 2)
        ]
    });
    res.redirect(url);
});

// 2. Callback Route: Google se wapas aane par
router.get('/google/callback', async (req, res, next) => {
    const code = req.query.code as string;

    try {
        // Code se tokens nikalo
        const { tokens } = await oauth2Client.getToken(code);
        
        // Tokens se user ki details verify karo
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        if (!payload) throw new Error("No payload");

        // User ko DB mein find karo ya naya banao (upsert)
        const user = await User.findOneAndUpdate(
            { googleId: payload.sub },
            {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                avatarUrl: payload.picture
            },
            { upsert: true, new: true } // Agar nahi mila toh naya bana de
        );

        // Hamara khud ka JWT banayo (frontend ke liye)
        const newJwt = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

        // JWT ko HttpOnly Cookie mein save karo (XSS attacks se bachne ke liye)
        res.cookie("token", newJwt, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production', // Prod mein HTTPS only
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din
        });

        // Frontend par redirect kar do
        res.redirect(env.CLIENT_URL);
    } catch (error) {
        next(error); // Error handler ko bhej do
    }
});

// 3. Get Current User (Frontend check karne ke liye ki login hai ya nahi)
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-__v');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// 4. Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(204).send();
});

export default router;