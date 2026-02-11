import express from "express";
import { addToCart, clearCart, getAllCart, getUserCart, removeFromCart, updateCart } from "../controllers/cartControllers";
import { authenticateAndSessionToken, authenticateToken, isAdminControl } from "../middleware/authMiddleware";

const router = express.Router();

router.get('/cart/all', authenticateToken, isAdminControl, getAllCart);
router.get('/cart', authenticateAndSessionToken, getUserCart);

router.post('/cart/add', authenticateAndSessionToken, addToCart);
router.put('/cart/update/:productId', authenticateAndSessionToken, updateCart);

router.delete('/cart/remove/:productId', authenticateAndSessionToken, removeFromCart);
router.delete('/cart/clear', authenticateAndSessionToken, clearCart);


export default router;