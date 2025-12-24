"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay keys not found in environment variables.');
}
let razorpayInstance;
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay keys not found. Using MOCK instance.');
    razorpayInstance = {
        orders: {
            create: async (options) => ({
                id: 'order_' + Date.now(),
                amount: options.amount,
                currency: options.currency,
                receipt: options.receipt,
                status: 'created',
            }),
        },
    };
}
else {
    razorpayInstance = new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}
exports.instance = razorpayInstance;
//# sourceMappingURL=razorpay.js.map