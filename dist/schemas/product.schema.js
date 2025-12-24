"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        description: zod_1.z.string().optional(),
        price: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val)),
        stock: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val)),
        categoryId: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val))
            .optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'ID must be a number'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val))
            .optional(),
        stock: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val))
            .optional(),
        categoryId: zod_1.z
            .string()
            .or(zod_1.z.number())
            .transform((val) => Number(val))
            .optional(),
    }),
});
exports.queryProductSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().default('1').transform(Number),
        limit: zod_1.z.string().optional().default('10').transform(Number),
        search: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().optional().transform(Number),
        minPrice: zod_1.z.string().optional().transform(Number),
        maxPrice: zod_1.z.string().optional().transform(Number),
    }),
});
//# sourceMappingURL=product.schema.js.map