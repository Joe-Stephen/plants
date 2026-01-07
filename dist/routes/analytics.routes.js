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
const analyticsController = __importStar(require("../controllers/analytics.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cache_middleware_1 = require("../middlewares/cache.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRole)('ADMIN'));
router.get('/dashboard', cache_middleware_1.cacheMiddleware, analyticsController.getDashboard);
router.get('/sales-chart', cache_middleware_1.cacheMiddleware, analyticsController.getSalesChart);
router.get('/top-products', cache_middleware_1.cacheMiddleware, analyticsController.getTopProducts);
router.get('/orders-by-status', cache_middleware_1.cacheMiddleware, analyticsController.getOrdersByStatus);
router.get('/category-sales', cache_middleware_1.cacheMiddleware, analyticsController.getCategorySales);
router.get('/new-users-chart', cache_middleware_1.cacheMiddleware, analyticsController.getNewUsersChart);
router.get('/low-stock', analyticsController.getLowStock);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map