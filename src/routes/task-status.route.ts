import { Router } from "express";
import { initializeDefaultStatuses, taskStatusSchema } from "../schemas/task-status.schema";
import { createTaskStatus, getTaskStatus } from "../controllers/task-status.controller";
import { validateBody } from "../middlewares/validateBody";

const router = Router();

initializeDefaultStatuses();

router.get('/task-status', getTaskStatus);
router.post('/task-status', validateBody(taskStatusSchema), createTaskStatus);

export default router;