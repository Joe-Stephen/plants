import { z } from 'zod';

export const queryOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => Number(val) || 1),
    limit: z.string().optional().transform(val => Number(val) || 10),
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
});
