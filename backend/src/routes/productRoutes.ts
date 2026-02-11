import express from "express";
import { createProduct, getActiveProduct, getAllProduct, getBySlugProduct, getSoftDeletedProduct, hardDeleteProduct, restoreProduct, softDeleteProduct, updateProduct } from "../controllers/productControllers";
import { authenticateToken, isAdminControl } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

const router = express.Router();

router.get(
    '/all/product',
    authenticateToken,
    isAdminControl,
    getAllProduct
);

router.get(`/product/:slug`, getBySlugProduct);

router.get(
    '/active/product',
    getActiveProduct
);

router.get(
    '/softDelete/product',
    authenticateToken,
    isAdminControl,
    getSoftDeletedProduct
);


router.post(
    '/create/product',
    authenticateToken,
    isAdminControl,
    upload.array('images', 5),
    createProduct
);


router.put(
    `/update/product/:id`,
    authenticateToken,
    isAdminControl,
    upload.array('images', 5),
    updateProduct
);


router.patch(
    `/softDelete/product/:id`,
    authenticateToken,
    isAdminControl,
    softDeleteProduct
);

router.patch(
    `/restore/product/:id`,
    authenticateToken,
    isAdminControl,
    restoreProduct
);


router.delete(
    `/delete/product/:id`,
    authenticateToken,
    isAdminControl,
    hardDeleteProduct
);


export default router;