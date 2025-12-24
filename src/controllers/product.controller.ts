import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.files is handled by multer
    // We need to parse body fields if they are strings (multipart/form-data sends everything as strings)
    // But our Zod schema handles string->number transformation!
    const product = await productService.createProduct(req.body, req.files as Express.Multer.File[]);
    res.status(201).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(Number(req.params.id), req.body);
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
