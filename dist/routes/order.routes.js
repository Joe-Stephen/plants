"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController = __importStar(require("../controllers/order.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const zod_1 = require("zod");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const order_management_schema_1 = require("../schemas/order-management.schema");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        addressId: zod_1.z.number(),
    }),
});
const verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        razorpayOrderId: zod_1.z.string(),
        razorpayPaymentId: zod_1.z.string(),
        signature: zod_1.z.string(),
    }),
});
router.use(auth_middleware_1.authenticate);
router.post('/', (0, validate_middleware_1.validate)(createOrderSchema), orderController.create);
router.post('/verify', (0, validate_middleware_1.validate)(verifyPaymentSchema), orderController.verify);
router.get('/my-orders', (0, validate_middleware_1.validate)(order_management_schema_1.queryOrdersSchema), orderController.listMyOrders);
router.get('/admin/all', (0, role_middleware_1.authorizeRole)('ADMIN'), (0, validate_middleware_1.validate)(order_management_schema_1.queryOrdersSchema), orderController.listAllOrders);
router.put('/:id/status', (0, role_middleware_1.authorizeRole)('ADMIN'), (0, validate_middleware_1.validate)(order_management_schema_1.updateOrderStatusSchema), orderController.updateStatus);
router.get('/:id', orderController.getDetails);
exports.default = router;
//# sourceMappingURL=order.routes.js.map