import express from "express";
import { login, logout, register } from "../controllers/authControllers";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

const authRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Çok fazla giriş denemesi! Lütfen 10 dakika sonra tekrar deneyiniz'
    },
    standardHeaders: true,
    legacyHeaders: true
});

router.post('/giris', authRateLimiter, login);
router.post('/kayit', register);
router.post('/cikis', authenticateToken, logout);


export default router;