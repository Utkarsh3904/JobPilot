import { Router } from "express";
import { 
    googleLogin, 
    googleCallback, 
    getMe, 
    logout 
} from "../controllers/auth.controllers";
import { requireAuth } from "../middleware/auth.middleware"; 

const router = Router();

// 1. Google Login (User ko Google pe bhejna)
router.get("/google", googleLogin);

// 2. Google Callback (Google se wapas aana)
router.get("/google/callback", googleCallback);

// 3. Mera Profile (Protected route - middleware pehle check karega)
router.get("/me", requireAuth, getMe);

// 4. Logout (Ticket phaadna)
router.post("/logout", logout);

export default router;