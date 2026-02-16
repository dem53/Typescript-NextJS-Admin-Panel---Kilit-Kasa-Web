import express from "express";
import { approveOrder, createOrder, getAllOrder, updateOrder } from "../controllers/orderControllers";
import { authenticateAndSessionToken, authenticateToken, isAdminControl, isAdminOrManager } from "../middleware/authMiddleware";

const router = express.Router();

router.get('/all/order', authenticateToken, isAdminOrManager, getAllOrder);
router.post('/create/order', authenticateAndSessionToken, createOrder);
router.patch('/update/order/:id', authenticateToken, isAdminControl, updateOrder);

router.put('/approve/order/:id', authenticateToken, isAdminControl, approveOrder);


export default router;