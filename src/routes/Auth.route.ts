import { Router } from 'express';
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validateBody';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/sign-up', validateBody(signUpSchema), signUp);
router.post('/sign-in', validateBody(signInSchema), signIn);
router.post('/sign-out', signOut);
router.post('/refresh-token', refreshToken);

export default router;