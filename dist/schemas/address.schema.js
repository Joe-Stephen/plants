"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    body: zod_1.z.object({
        street: zod_1.z.string().min(3, 'Street is required'),
        city: zod_1.z.string().min(2, 'City is required'),
        state: zod_1.z.string().min(2, 'State is required'),
        zip: zod_1.z.string().min(3, 'Zip code is required'),
        country: zod_1.z.string().min(2, 'Country is required'),
        is_default: zod_1.z.boolean().optional(),
    }),
});
exports.updateAddressSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'ID must be a number'),
    }),
    body: zod_1.z.object({
        street: zod_1.z.string().min(3).optional(),
        city: zod_1.z.string().min(2).optional(),
        state: zod_1.z.string().min(2).optional(),
        zip: zod_1.z.string().min(3).optional(),
        country: zod_1.z.string().min(2).optional(),
        is_default: zod_1.z.boolean().optional(),
    }),
});
//# sourceMappingURL=address.schema.js.map