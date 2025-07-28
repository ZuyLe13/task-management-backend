import { Router } from "express";
import { createTask, getAllTask } from "../controllers/task.controller";

const router = Router();

router.get('/task', getAllTask);
router.post('/task', createTask);

export default router;