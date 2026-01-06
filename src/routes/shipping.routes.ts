import { Router } from 'express';
import * as shippingController from '../controllers/shipping.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint: POST /api/shipping/serviceability
// Protected route? Probably good to protect it, but typically checkout can be guest.
// For now, let's keep it authenticated as per project pattern, or make it public if needed.
// User requirement says "Implement Shiprocket serviceability check API".
// Usually this is called during checkout. Let's start with authenticated.

router.post(
  '/serviceability',
  authenticate,
  shippingController.checkServiceability,
);

router.post('/rates', authenticate, shippingController.getRates);

export default router;
