import express from "express";
import { authenticateToken, isAdminAndManagerOrPersonel, isAdminControl } from "../middleware/authMiddleware";
import { createJob, deleteJob, getAllJob, updateJob } from "../controllers/jobControllers";

const router = express.Router();

router.get('/all/job', authenticateToken, isAdminAndManagerOrPersonel, getAllJob);
router.post('/create/job', authenticateToken, isAdminControl, createJob);
router.patch('/update/job/:id', authenticateToken, isAdminAndManagerOrPersonel, updateJob);
router.delete('/delete/job/:id', authenticateToken, isAdminControl, deleteJob);


export default router;