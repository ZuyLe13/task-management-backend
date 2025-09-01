import { Router } from "express";
import { createTask, getAllTask, updateTask, deleteTask, updateTaskStatus } from "../controllers/task.controller";
import { validateBody } from "../middlewares/validateBody";
import taskSchema from "../schemas/task.schema";

const router = Router();

router.get('/task', getAllTask);
router.post('/task', validateBody(taskSchema), createTask);
router.put('/task/:id', updateTask);
router.patch('/tasks/:taskKey/status', updateTaskStatus);
router.delete('/task/:taskKey', deleteTask);

export default router;