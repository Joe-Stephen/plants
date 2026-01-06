import { Request, Response, NextFunction } from 'express';
import { shiprocketService } from '../services/shiprocket.service';
import { AppError } from '../utils/AppError';

export const checkServiceability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      pickup_pincode,
      delivery_pincode,
      weight,
      length,
      breadth,
      height,
      cod,
    } = req.body;

    if (!pickup_pincode || !delivery_pincode || !weight) {
      throw new AppError(
        'Missing required fields: pickup_pincode, delivery_pincode, weight',
        400,
      );
    }

    const result = await shiprocketService.checkServiceability(
      Number(pickup_pincode),
      Number(delivery_pincode),
      Number(weight),
      Number(length) || 10,
      Number(breadth) || 10,
      Number(height) || 10,
      Boolean(cod),
    );

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      pickup_pincode,
      delivery_pincode,
      weight,
      length,
      breadth,
      height,
      cod,
    } = req.body;

    if (!pickup_pincode || !delivery_pincode || !weight) {
      throw new AppError(
        'Missing required fields: pickup_pincode, delivery_pincode, weight',
        400,
      );
    }

    const rates = await shiprocketService.getShippingRates(
      Number(pickup_pincode),
      Number(delivery_pincode),
      Number(weight),
      Number(length) || 10,
      Number(breadth) || 10,
      Number(height) || 10,
      Boolean(cod),
    );

    res.status(200).json({
      status: 'success',
      data: rates,
    });
  } catch (error) {
    next(error);
  }
};
