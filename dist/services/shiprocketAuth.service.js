"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiprocketAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../utils/AppError");
class ShiprocketAuthService {
    constructor() {
        this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
        this.tokenData = null;
    }
    async getToken() {
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;
        if (this.tokenData && Date.now() < this.tokenData.expiresAt - 3600000) {
            return this.tokenData.token;
        }
        if (!email || !password) {
            console.warn('Shiprocket credentials missing. Using Mock Mode.');
            return 'MOCK_TOKEN';
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/auth/login`, {
                email,
                password,
            });
            this.tokenData = {
                token: response.data.token,
                expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
            };
            return this.tokenData.token;
        }
        catch (error) {
            console.error('Shiprocket Login Failed:', error.response?.data || error);
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Dev/Test Mode: Falling back to MOCK_TOKEN due to login failure.');
                return 'MOCK_TOKEN';
            }
            throw new AppError_1.AppError('Shipping provider unavailable', 503);
        }
    }
}
exports.shiprocketAuthService = new ShiprocketAuthService();
//# sourceMappingURL=shiprocketAuth.service.js.map