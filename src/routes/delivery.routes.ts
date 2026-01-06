import { Router } from 'express';
import * as deliveryController from '../controllers/delivery.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protect delivery check or leave public? Usually public or protected.
// Let's keep it authenticated for now to match other flows.
router.use(authenticate);

router.get('/check', deliveryController.checkServiceability);

export default router;
