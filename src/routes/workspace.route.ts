import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { createWorkspace } from "../controllers/workspace.controller";
import { validateBody } from "../middlewares/validateBody";
import { WorkspaceSchema } from "../schemas/workspace.schema";

const router = Router();

router.post(
  '/workspace', 
  authenticateToken, 
  validateBody(WorkspaceSchema), 
  createWorkspace
);

export default router;