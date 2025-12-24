import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    street: z.string().min(3, 'Street is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zip: z.string().min(3, 'Zip code is required'),
    country: z.string().min(2, 'Country is required'),
    is_default: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  body: z.object({
    street: z.string().min(3).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    zip: z.string().min(3).optional(),
    country: z.string().min(2).optional(),
    is_default: z.boolean().optional(),
  }),
});
