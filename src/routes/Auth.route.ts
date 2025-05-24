import { Router } from 'express';
import {
  signIn,
  signUp,
} from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validateBody';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/sign-up', validateBody(signUpSchema), signUp);
router.post('/sign-in', validateBody(signInSchema), signIn);

export default router;