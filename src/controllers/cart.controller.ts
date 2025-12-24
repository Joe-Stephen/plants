import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';

const getIds = (req: Request) => {
  const userId = req.user ? req.user.id : null;
  const sessionId = req.headers['x-session-id'] as string || null;
  return { userId, sessionId };
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId } = getIds(req);
    const cart = await cartService.getCart(userId, sessionId);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId } = getIds(req);
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, sessionId, productId, quantity);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId } = getIds(req);
    const cart = await cartService.updateItem(userId, sessionId, Number(req.params.id), req.body.quantity);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId } = getIds(req);
    const cart = await cartService.removeItem(userId, sessionId, Number(req.params.id));
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const merge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'fail', message: 'User must be logged in to merge cart' });
      return;
    }
    const { sessionId } = req.body;
    const cart = await cartService.mergeGuestCart(req.user.id, sessionId);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};
