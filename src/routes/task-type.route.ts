import { Router } from "express";
import { createTaskType, getAllTaskType } from "../controllers/task-type.controller";
import { validateBody } from "../middlewares/validateBody";
import { taskTypeValidationSchema } from "../schemas/task-type.schema";

const router = Router();

router.get('/task-type', getAllTaskType);
router.post('/task-type', validateBody(taskTypeValidationSchema), createTaskType);

export default router;