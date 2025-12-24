"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCartSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.number(),
        quantity: zod_1.z.number().min(1).default(1),
    }),
});
exports.updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'ID must be a number'),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().min(1),
    }),
});
exports.mergeCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        sessionId: zod_1.z.string().min(1, 'Session ID is required'),
    }),
});
//# sourceMappingURL=cart.schema.js.map