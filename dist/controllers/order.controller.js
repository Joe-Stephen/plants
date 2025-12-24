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
exports.updateStatus = exports.listAllOrders = exports.getDetails = exports.listMyOrders = exports.verify = exports.create = void 0;
const orderService = __importStar(require("../services/order.service"));
const create = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { addressId } = req.body;
        const data = await orderService.createOrder(req.user.id, addressId);
        res.status(201).json({ status: 'success', data });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const verify = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
        const order = await orderService.verifyPayment(req.user.id, razorpayOrderId, razorpayPaymentId, signature);
        res.status(200).json({ status: 'success', data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.verify = verify;
const listMyOrders = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const result = await orderService.getUserOrders(req.user.id, req.query);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.listMyOrders = listMyOrders;
const getDetails = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        const order = await orderService.getOrderById(Number(req.params.id), userId);
        res.status(200).json({ status: 'success', data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.getDetails = getDetails;
const listAllOrders = async (req, res, next) => {
    try {
        const result = await orderService.getAllOrders(req.query);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.listAllOrders = listAllOrders;
const updateStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
        res.status(200).json({ status: 'success', data: { order } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=order.controller.js.map