import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import addressRoutes from './address.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';
import analyticsRoutes from './analytics.routes';
import deliveryRoutes from './delivery.routes';
import shippingRoutes from './shipping.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/shipping', shippingRoutes);

export default router;
