"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const address_routes_1 = __importDefault(require("./address.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const delivery_routes_1 = __importDefault(require("./delivery.routes"));
const shipping_routes_1 = __importDefault(require("./shipping.routes"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});
router.use('/auth', auth_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/cart', cart_routes_1.default);
router.use('/addresses', address_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/delivery', delivery_routes_1.default);
router.use('/shipping', shipping_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map