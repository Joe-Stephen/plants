import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    price: z
      .string()
      .or(z.number())
      .transform((val) => Number(val)),
    stock: z
      .string()
      .or(z.number())
      .transform((val) => Number(val)),
    categoryId: z
      .string()
      .or(z.number())
      .transform((val) => Number(val))
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z
      .string()
      .or(z.number())
      .transform((val) => Number(val))
      .optional(),
    stock: z
      .string()
      .or(z.number())
      .transform((val) => Number(val))
      .optional(),
    categoryId: z
      .string()
      .or(z.number())
      .transform((val) => Number(val))
      .optional(),
  }),
});

export const queryProductSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number),
    search: z.string().optional(),
    categoryId: z.string().optional().transform(Number),
    minPrice: z.string().optional().transform(Number),
    maxPrice: z.string().optional().transform(Number),
  }),
});
