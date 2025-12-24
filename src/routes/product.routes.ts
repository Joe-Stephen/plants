import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { createProductSchema, updateProductSchema, queryProductSchema } from '../schemas/product.schema';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/', validate(queryProductSchema), productController.getAll);
router.get('/:id', productController.getById);

router.post(
  '/',
  authenticate,
  authorizeRole('ADMIN'),
  upload.array('images', 5), // Allow up to 5 images
  validate(createProductSchema),
  productController.create
);

router.put(
  '/:id',
  authenticate,
  authorizeRole('ADMIN'),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  authorizeRole('ADMIN'),
  productController.remove
);

export default router;
