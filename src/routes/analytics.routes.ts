import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';
import { cacheMiddleware } from '../middlewares/cache.middleware';

const router = Router();

// Protect all analytics routes - ADMIN only
router.use(authenticate, authorizeRole('ADMIN'));

router.get('/dashboard', cacheMiddleware, analyticsController.getDashboard);
router.get('/sales-chart', cacheMiddleware, analyticsController.getSalesChart);
router.get(
  '/top-products',
  cacheMiddleware,
  analyticsController.getTopProducts,
);
router.get(
  '/orders-by-status',
  cacheMiddleware,
  analyticsController.getOrdersByStatus,
);
router.get(
  '/category-sales',
  cacheMiddleware,
  analyticsController.getCategorySales,
);
router.get(
  '/new-users-chart',
  cacheMiddleware,
  analyticsController.getNewUsersChart,
);
router.get('/low-stock', analyticsController.getLowStock);

export default router;
