"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServiceability = void 0;
const shiprocket_service_1 = require("../services/shiprocket.service");
const checkServiceability = async (req, res, next) => {
    try {
        const { pincode, weight } = req.query;
        if (!pincode) {
            res.status(400).json({ status: 'fail', message: 'Pincode is required' });
            return;
        }
        const pickupPincode = parseInt(process.env.PICKUP_PINCODE || '110001');
        const weightVal = weight ? parseFloat(weight) : 0.5;
        const result = await shiprocket_service_1.shiprocketService.checkServiceability(pickupPincode, parseInt(pincode), weightVal);
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
//# sourceMappingURL=delivery.controller.js.map