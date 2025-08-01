import { Router } from "express";
import { taskStatusSchema, updateTaskStatusSchema } from "../schemas/task-status.schema";
import { createTaskStatus, deleteTaskStatus, getTaskStatus, updateTaskStatus } from "../controllers/task-status.controller";
import { validateBody } from "../middlewares/validateBody";

const router = Router();

router.get('/task-status', getTaskStatus);
router.post('/task-status', validateBody(taskStatusSchema), createTaskStatus);
router.put('/task-status/:id', validateBody(updateTaskStatusSchema), updateTaskStatus);
router.delete('/task-status/:id', deleteTaskStatus);

export default router;