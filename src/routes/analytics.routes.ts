import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Protect all analytics routes - ADMIN only
router.use(authenticate, authorizeRole('ADMIN'));

router.get('/dashboard', analyticsController.getDashboard);
router.get('/sales-chart', analyticsController.getSalesChart);
router.get('/top-products', analyticsController.getTopProducts);
router.get('/orders-by-status', analyticsController.getOrdersByStatus);
router.get('/category-sales', analyticsController.getCategorySales);
router.get('/new-users-chart', analyticsController.getNewUsersChart);
router.get('/low-stock', analyticsController.getLowStock);

export default router;
