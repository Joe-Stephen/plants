import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number(),
    quantity: z.number().min(1).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  body: z.object({
    quantity: z.number().min(1),
  }),
});

export const mergeCartSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
  }),
});
