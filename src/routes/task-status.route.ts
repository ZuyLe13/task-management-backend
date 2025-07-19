import { Router } from "express";
import { initializeDefaultStatuses } from "../schemas/task-status.schema";
import { getTaskStatus } from "../controllers/task-status.controller";

const router = Router();

initializeDefaultStatuses();

router.get('/task-status', getTaskStatus);

export default router;