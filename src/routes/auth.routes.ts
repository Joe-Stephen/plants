import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { signupSchema, loginSchema } from '../schemas/auth.schema';

import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

import { authLimiter } from '../middlewares/rateLimiter';

// ...

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
