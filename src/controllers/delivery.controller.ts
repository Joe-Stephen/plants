import { Request, Response, NextFunction } from 'express';
import { shiprocketService } from '../services/shiprocket.service';

export const checkServiceability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { pincode, weight } = req.query;

    if (!pincode) {
      res.status(400).json({ status: 'fail', message: 'Pincode is required' });
      return;
    }

    // Default pickup pincode (should be in env)
    const pickupPincode = parseInt(process.env.PICKUP_PINCODE || '110001');

    // Default weight 0.5kg if not provided
    const weightVal = weight ? parseFloat(weight as string) : 0.5;

    const result = await shiprocketService.checkServiceability(
      pickupPincode,
      parseInt(pincode as string),
      weightVal,
    );

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
