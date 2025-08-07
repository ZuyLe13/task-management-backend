import { Router } from "express";
import { getAllPriorities, getPriorityById, createPriority } from '../controllers/priority.controller';
import { validateBody } from "../middlewares/validateBody";
import { prioritySchema } from "../schemas/priority.schema";

const router = Router();

router.get('/priority', getAllPriorities);
router.get('/priority/:id', getPriorityById);
router.post('/priority', validateBody(prioritySchema), createPriority);

export default router;