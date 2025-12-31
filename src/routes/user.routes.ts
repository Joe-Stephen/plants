import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(restrictTo('ADMIN'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);

export default router;
