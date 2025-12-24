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
exports.merge = exports.remove = exports.update = exports.add = exports.get = void 0;
const cartService = __importStar(require("../services/cart.service"));
const getIds = (req) => {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || null;
    return { userId, sessionId };
};
const get = async (req, res, next) => {
    try {
        const { userId, sessionId } = getIds(req);
        const cart = await cartService.getCart(userId, sessionId);
        res.status(200).json({ status: 'success', data: { cart } });
    }
    catch (error) {
        next(error);
    }
};
exports.get = get;
const add = async (req, res, next) => {
    try {
        const { userId, sessionId } = getIds(req);
        const { productId, quantity } = req.body;
        const cart = await cartService.addToCart(userId, sessionId, productId, quantity);
        res.status(200).json({ status: 'success', data: { cart } });
    }
    catch (error) {
        next(error);
    }
};
exports.add = add;
const update = async (req, res, next) => {
    try {
        const { userId, sessionId } = getIds(req);
        const cart = await cartService.updateItem(userId, sessionId, Number(req.params.id), req.body.quantity);
        res.status(200).json({ status: 'success', data: { cart } });
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const { userId, sessionId } = getIds(req);
        const cart = await cartService.removeItem(userId, sessionId, Number(req.params.id));
        res.status(200).json({ status: 'success', data: { cart } });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
const merge = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ status: 'fail', message: 'User must be logged in to merge cart' });
            return;
        }
        const { sessionId } = req.body;
        const cart = await cartService.mergeGuestCart(req.user.id, sessionId);
        res.status(200).json({ status: 'success', data: { cart } });
    }
    catch (error) {
        next(error);
    }
};
exports.merge = merge;
//# sourceMappingURL=cart.controller.js.map