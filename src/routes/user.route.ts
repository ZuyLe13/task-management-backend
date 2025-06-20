import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { getUserProfile } from "../controllers/user.controller";

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);

export default router;