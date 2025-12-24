import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const { addressId } = req.body;
    const data = await orderService.createOrder(req.user.id, addressId);
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const order = await orderService.verifyPayment(
      req.user.id,
      razorpayOrderId,
      razorpayPaymentId,
      signature
    );
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const result = await orderService.getUserOrders(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id; // Admin can see any order
    const order = await orderService.getOrderById(Number(req.params.id), userId);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};
