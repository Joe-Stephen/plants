"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.queryOrdersSchema = void 0;
const zod_1 = require("zod");
exports.queryOrdersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => Number(val) || 1),
        limit: zod_1.z.string().optional().transform(val => Number(val) || 10),
        status: zod_1.z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    }),
});
//# sourceMappingURL=order-management.schema.js.map