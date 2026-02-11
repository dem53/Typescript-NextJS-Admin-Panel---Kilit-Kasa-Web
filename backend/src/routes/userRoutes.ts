import express from "express";
import { authenticateToken, isAdminControl } from "../middleware/authMiddleware";
import { createUser, deleteUser, getAllUser, getMe, updateUser } from "../controllers/userControllers";

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.get('/all/user', authenticateToken, isAdminControl, getAllUser);
router.post('/create/user', authenticateToken, isAdminControl, createUser);
router.put('/update/user/:id', authenticateToken, isAdminControl, updateUser);
router.delete('/delete/user/:id', authenticateToken, isAdminControl, deleteUser);


export default router;