import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware';
import { queryOrdersSchema, updateOrderStatusSchema } from '../schemas/order-management.schema';

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    addressId: z.number(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    signature: z.string(),
  }),
});

router.use(authenticate);

// User Routes
router.post('/', validate(createOrderSchema), orderController.create);
router.post('/verify', validate(verifyPaymentSchema), orderController.verify);
router.get('/my-orders', validate(queryOrdersSchema), orderController.listMyOrders);

// Admin Routes
router.get('/admin/all', authorizeRole('ADMIN'), validate(queryOrdersSchema), orderController.listAllOrders);
router.put('/:id/status', authorizeRole('ADMIN'), validate(updateOrderStatusSchema), orderController.updateStatus);

// Shared Route (placed last to avoid conflict with /my-orders or /admin/all if id is not regex restricted, though mostly safe here if id is number. 
// However, express matches sequentially. 'my-orders' is not a number, but 'admin' matches if regex not strict.
// Best to keep specific routes above param routes.)
router.get('/:id', orderController.getDetails);

export default router;
