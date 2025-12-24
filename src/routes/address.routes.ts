import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema';

const router = Router();

router.use(authenticate); // Protect all routes

router.get('/', addressController.getAll);
router.get('/:id', addressController.getById);
router.post('/', validate(createAddressSchema), addressController.create);
router.put('/:id', validate(updateAddressSchema), addressController.update);
router.delete('/:id', addressController.remove);

export default router;
