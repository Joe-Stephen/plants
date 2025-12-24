"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        description: zod_1.z.string().optional(),
        parentId: zod_1.z.number().optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'ID must be a number'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        description: zod_1.z.string().optional(),
        parentId: zod_1.z.number().nullable().optional(),
    }),
});
//# sourceMappingURL=category.schema.js.map