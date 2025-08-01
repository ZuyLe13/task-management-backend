import { Router } from "express";
import { createTask, getAllTask } from "../controllers/task.controller";
import { validateBody } from "../middlewares/validateBody";
import taskSchema from "../schemas/task.schema";

const router = Router();

router.get('/task', getAllTask);
router.post('/task', validateBody(taskSchema), createTask);

export default router;