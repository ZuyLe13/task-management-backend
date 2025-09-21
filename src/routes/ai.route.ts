import { Router } from 'express';
import { chat, chatStream, generate } from '../controllers/ai.controller';

const router = Router();

router.post('/generate', generate);
router.post('/chat', chat);
router.post('/chat-stream', chatStream);

export default router;