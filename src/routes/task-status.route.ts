import { Router } from "express";
import { initializeDefaultStatuses, taskStatusSchema, updateTaskStatusSchema } from "../schemas/task-status.schema";
import { createTaskStatus, getTaskStatus, updateTaskStatus } from "../controllers/task-status.controller";
import { validateBody } from "../middlewares/validateBody";

const router = Router();

initializeDefaultStatuses();

router.get('/task-status', getTaskStatus);
router.post('/task-status', validateBody(taskStatusSchema), createTaskStatus);
router.put('/api/v1/task-status/:id', validateBody(updateTaskStatusSchema), updateTaskStatus);

export default router;