"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRates = exports.checkServiceability = void 0;
const shiprocket_service_1 = require("../services/shiprocket.service");
const AppError_1 = require("../utils/AppError");
const checkServiceability = async (req, res, next) => {
    try {
        const { pickup_pincode, delivery_pincode, weight, length, breadth, height, cod, } = req.body;
        if (!pickup_pincode || !delivery_pincode || !weight) {
            throw new AppError_1.AppError('Missing required fields: pickup_pincode, delivery_pincode, weight', 400);
        }
        const result = await shiprocket_service_1.shiprocketService.checkServiceability(Number(pickup_pincode), Number(delivery_pincode), Number(weight), Number(length) || 10, Number(breadth) || 10, Number(height) || 10, Boolean(cod));
        res.status(200).json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.checkServiceability = checkServiceability;
const getRates = async (req, res, next) => {
    try {
        const { pickup_pincode, delivery_pincode, weight, length, breadth, height, cod, } = req.body;
        if (!pickup_pincode || !delivery_pincode || !weight) {
            throw new AppError_1.AppError('Missing required fields: pickup_pincode, delivery_pincode, weight', 400);
        }
        const rates = await shiprocket_service_1.shiprocketService.getShippingRates(Number(pickup_pincode), Number(delivery_pincode), Number(weight), Number(length) || 10, Number(breadth) || 10, Number(height) || 10, Boolean(cod));
        res.status(200).json({
            status: 'success',
            data: rates,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRates = getRates;
//# sourceMappingURL=shipping.controller.js.map