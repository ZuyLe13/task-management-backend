import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller";

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;