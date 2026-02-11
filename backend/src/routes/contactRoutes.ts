import express from "express";
import rateLimit from "express-rate-limit";
import { getAllContact, createContact, updateContact, deleteContact } from "../controllers/contactControllers";
import { authenticateToken, isAdminControl } from "../middleware/authMiddleware";

const router = express.Router();

const contactRateLimit = rateLimit({
    windowMs: 10 * 1000 * 60,
    max: 5,
    message: {
        success: false,
        message: 'Çok fazla iletişim form isteği'
    },
    legacyHeaders: true,
    standardHeaders: true
})

router.get('/all/contact', authenticateToken, isAdminControl, getAllContact);
router.post('/create/contact', contactRateLimit, createContact);
router.patch('/update/contact/:id', authenticateToken, isAdminControl, updateContact);
router.delete('/delete/contact/:id', authenticateToken, isAdminControl, deleteContact);


export default router;