import { Router } from "express";
import { getAllPriorities, getPriorityById, createPriority, updatePriority, deletePriority } from '../controllers/priority.controller';
import { validateBody } from "../middlewares/validateBody";
import { prioritySchema, updatePrioritySchema } from "../schemas/priority.schema";

const router = Router();

router.get('/priority', getAllPriorities);
router.get('/priority/:id', getPriorityById);
router.post('/priority', validateBody(prioritySchema), createPriority);
router.put('/priority/:id', validateBody(updatePrioritySchema), updatePriority);
router.delete('/priority/:id', deletePriority)

export default router;