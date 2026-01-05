import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, restrictTo } from '../middlewares/auth.middleware';

import { apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(restrictTo('ADMIN'));

router.get('/', apiLimiter, userController.getAll);
router.get('/:id', userController.getById);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/status', userController.updateStatus);

export default router;
