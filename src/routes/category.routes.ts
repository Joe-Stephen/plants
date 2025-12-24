import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

router.post(
  '/',
  authenticate,
  authorizeRole('ADMIN'),
  validate(createCategorySchema),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  authorizeRole('ADMIN'),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorizeRole('ADMIN'),
  categoryController.remove
);

export default router;
