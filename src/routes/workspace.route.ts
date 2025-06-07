import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { createWorkspace } from "../controllers/workspace.controller";
import { validateBody } from "../middlewares/validateBody";
import { WorkspaceSchema } from "../schemas/workspace.schema";
import { upload } from "../middlewares/upload";

const router = Router();

router.post(
  '/workspace', 
  authenticateToken, 
  upload.single('image'),
  validateBody(WorkspaceSchema), 
  createWorkspace
);

export default router;