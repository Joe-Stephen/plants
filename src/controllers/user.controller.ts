import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../utils/AppError';

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

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIdToUpdate = Number(req.params.id);
    const { role } = req.body;

    if (role !== 'USER' && role !== 'ADMIN') {
      return next(new AppError('Invalid role. Use USER or ADMIN.', 400));
    }

    // Prevent self-demotion/promotion if needed, but primarily self-demotion is dangerous
    // Assuming req.user is populated by authenticate middleware
    const currentUser = (req as any).user;
    if (currentUser && currentUser.id === userIdToUpdate && role !== 'ADMIN') {
      // If current user is trying to change their own role to something else (e.g. USER)
      return next(new AppError('You cannot demote yourself.', 403));
    }

    const user = await userService.updateUserRole(userIdToUpdate, role);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIdToUpdate = Number(req.params.id);
    let { status } = req.body;

    // Map BLOCKED to inactive, ACTIVE to active (case-insensitive)
    if (status && status.toUpperCase() === 'BLOCKED') status = 'inactive';
    if (status && status.toUpperCase() === 'ACTIVE') status = 'active';

    if (status !== 'active' && status !== 'inactive') {
      return next(new AppError('Invalid status. Use ACTIVE or BLOCKED.', 400));
    }

    const currentUser = (req as any).user;
    if (
      currentUser &&
      currentUser.id === userIdToUpdate &&
      status === 'inactive'
    ) {
      return next(new Error('You cannot block yourself.'));
    }

    const user = await userService.updateUserStatus(userIdToUpdate, status);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};
