import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { validate } from '../middlewares/validate.middleware';
import { addToCartSchema, updateCartItemSchema, mergeCartSchema } from '../schemas/cart.schema';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Middleware to optionally authenticate (we can't just use `authenticate` globally here because guest access is allowed)
// However, our current `authenticate` throws 401 if no token. We need a "tryAuthenticate" or just handle it in controller 
// by checking header. But wait, `req.user` is only set if `authenticate` runs.
// Strategy: Since some routes are dual (guest/user), we can use a custom middleware or just parse headers manually 
// if token exists for GET/POST.
// Actually, let's make a strict Authenticate for Merge.
// For others, we can parse JWT manually if header exists, OR create a `optionalAuth` middleware.

import jwt from 'jsonwebtoken';
import models from '../models';

const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const currentUser = await models.User.findByPk(decoded.id);
      if (currentUser) {
        req.user = currentUser;
      }
    }
    next();
  } catch (err) {
    // If invalid token, we can treat as guest? Or throw?
    // Usually if token is invalid, we should probably tell the user. But for "optional", maybe just ignore.
    // Let's ignore for now to allow fallback to guest session if token expired (though dangerous).
    // Better: if token provided but invalid -> 401. If no token -> Guest.
    if (req.headers.authorization) {
        // Token was sent but failed verification
        return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
    next();
  }
};

router.get('/', optionalAuth, cartController.get);
router.post('/', optionalAuth, validate(addToCartSchema), cartController.add);
router.put('/items/:id', optionalAuth, validate(updateCartItemSchema), cartController.update);
router.delete('/items/:id', optionalAuth, cartController.remove);

router.post('/merge', authenticate, validate(mergeCartSchema), cartController.merge);

export default router;
