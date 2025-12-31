import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categories, metadata } = await categoryService.getAllCategories(
      req.query,
    );
    res.status(200).json({ status: 'success', data: { categories, metadata } });
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
    const category = await categoryService.getCategoryById(
      Number(req.params.id),
    );
    res.status(200).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.updateCategory(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
