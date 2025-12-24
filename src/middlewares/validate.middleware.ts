import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: ZodSchema<any>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = (error as any).errors.map((e: any) => e.message).join(', ');
        return next(new AppError(`Validation Error: ${message}`, 400));
      }
      return next(error);
    }
  };
