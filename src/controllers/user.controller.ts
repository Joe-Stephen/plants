import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { users, metadata } = await userService.getAllUsers(req.query);
    res.status(200).json({ status: 'success', data: { users, metadata } });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};
