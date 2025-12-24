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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController = __importStar(require("../controllers/cart.controller"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const cart_schema_1 = require("../schemas/cart.schema");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models"));
const optionalAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            const currentUser = await models_1.default.User.findByPk(decoded.id);
            if (currentUser) {
                req.user = currentUser;
            }
        }
        next();
    }
    catch (err) {
        if (req.headers.authorization) {
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next();
    }
};
router.get('/', optionalAuth, cartController.get);
router.post('/', optionalAuth, (0, validate_middleware_1.validate)(cart_schema_1.addToCartSchema), cartController.add);
router.put('/items/:id', optionalAuth, (0, validate_middleware_1.validate)(cart_schema_1.updateCartItemSchema), cartController.update);
router.delete('/items/:id', optionalAuth, cartController.remove);
router.post('/merge', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(cart_schema_1.mergeCartSchema), cartController.merge);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map