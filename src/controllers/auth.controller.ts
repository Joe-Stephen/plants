import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
