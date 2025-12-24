import { Request, Response, NextFunction } from 'express';
import * as addressService from '../services/address.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return; // Should be handled by auth middleware
    const addresses = await addressService.getAllAddresses(req.user.id);
    res.status(200).json({ status: 'success', data: { addresses } });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const address = await addressService.getAddressById(req.user.id, Number(req.params.id));
    res.status(200).json({ status: 'success', data: { address } });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: { address } });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const address = await addressService.updateAddress(req.user.id, Number(req.params.id), req.body);
    res.status(200).json({ status: 'success', data: { address } });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    await addressService.deleteAddress(req.user.id, Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
