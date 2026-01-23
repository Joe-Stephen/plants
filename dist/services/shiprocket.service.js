"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiprocketService = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../utils/AppError");
const shiprocketAuth_service_1 = require("./shiprocketAuth.service");
class ShiprocketService {
    constructor() {
        this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
        this.cache = new Map();
    }
    async fetchServiceabilityRaw(pickupPincode, deliveryPincode, weight, length, breadth, height, cod) {
        const cacheKey = `${pickupPincode}-${deliveryPincode}-${weight}-${length}-${breadth}-${height}-${cod}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() < cached.expiresAt) {
            console.log('Serving serviceability from cache');
            return cached.data;
        }
        const token = await shiprocketAuth_service_1.shiprocketAuthService.getToken();
        if (token === 'MOCK_TOKEN') {
            const mockCouriers = [
                {
                    courier_name: 'Mock Courier Standard',
                    courier_company_id: 1,
                    rate: 50,
                    etd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    rating: 4.5,
                    cod: 1,
                },
                {
                    courier_name: 'Mock Courier Express',
                    courier_company_id: 2,
                    rate: 100,
                    etd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    rating: 4.8,
                    cod: 1,
                },
            ];
            this.cache.set(cacheKey, {
                data: mockCouriers,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
            return mockCouriers;
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/courier/serviceability`, {
                params: {
                    pickup_postcode: pickupPincode,
                    delivery_postcode: deliveryPincode,
                    weight,
                    length,
                    breadth,
                    height,
                    cod: cod ? 1 : 0,
                },
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            const data = response.data.data;
            if (!data ||
                !data.available_courier_companies ||
                data.available_courier_companies.length === 0) {
                throw new AppError_1.AppError('No delivery service available for this location', 400);
            }
            this.cache.set(cacheKey, {
                data: data.available_courier_companies,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
            return data.available_courier_companies;
        }
        catch (error) {
            console.error('Shiprocket Serviceability Check Failed:', JSON.stringify(error.response?.data || error.message, null, 2));
            throw new AppError_1.AppError('Unable to calculate shipping', 400);
        }
    }
    async getPickupLocations() {
        const token = await shiprocketAuth_service_1.shiprocketAuthService.getToken();
        if (token === 'MOCK_TOKEN') {
            return {
                data: {
                    shipping_address: [
                        {
                            pickup_location: 'Primary',
                            address: 'Mock Address',
                            city: 'Mock City',
                            pin_code: 110001,
                        },
                    ],
                },
            };
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/settings/company/pickup`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Shiprocket Pickup Locations Fetch Failed:', JSON.stringify(error.response?.data || error.message, null, 2));
            throw new AppError_1.AppError('Failed to fetch pickup locations', 502);
        }
    }
    async getShippingRates(pickupPincode, deliveryPincode, weight, length = 10, breadth = 10, height = 10, cod = false) {
        const couriers = await this.fetchServiceabilityRaw(pickupPincode, deliveryPincode, weight, length, breadth, height, cod);
        const mapped = couriers.map((c) => ({
            courier_name: c.courier_name,
            courier_company_id: c.courier_company_id,
            rate: c.rate,
            etd: c.etd,
            rating: c.rating || 0,
            cod_available: c.cod === 1,
        }));
        return mapped.sort((a, b) => {
            if (a.rate !== b.rate)
                return a.rate - b.rate;
            return new Date(a.etd).getTime() - new Date(b.etd).getTime();
        });
    }
    async checkServiceability(pickupPincode, deliveryPincode, weight, length = 10, breadth = 10, height = 10, cod = false) {
        const couriers = await this.fetchServiceabilityRaw(pickupPincode, deliveryPincode, weight, length, breadth, height, cod);
        const bestCourier = couriers.reduce((prev, curr) => {
            return prev.rate < curr.rate ? prev : curr;
        });
        return {
            courier_name: bestCourier.courier_name,
            courier_id: bestCourier.courier_company_id || 'MOCK_ID',
            rate: bestCourier.rate,
            etd: bestCourier.etd,
            cod_available: bestCourier.cod === 1,
        };
    }
    async createOrder(orderData) {
        const token = await shiprocketAuth_service_1.shiprocketAuthService.getToken();
        if (token === 'MOCK_TOKEN') {
            console.log('Mock Shiprocket Order Created:', orderData);
            return {
                order_id: 'MOCK_SR_ORDER_' + Date.now(),
                shipment_id: 'MOCK_SR_SHIP_' + Date.now(),
            };
        }
        try {
            const url = `${this.baseUrl}/orders/create/adhoc`;
            const response = await axios_1.default.post(url, orderData, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Shiprocket Order Creation Failed:', JSON.stringify(error.response?.data || error.message, null, 2));
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors
                    ? JSON.stringify(error.response.data.errors)
                    : 'Failed to place shipping order');
            throw new AppError_1.AppError(errorMessage, 502);
        }
    }
    async generateAWB(shipmentId, courierId) {
        const token = await shiprocketAuth_service_1.shiprocketAuthService.getToken();
        if (token === 'MOCK_TOKEN') {
            const mockAWB = 'MOCK_AWB_' + Date.now();
            return {
                awb_code: mockAWB,
                tracking_url: `https://shiprocket.co/tracking/${mockAWB}`,
                courier_company_id: courierId,
                shipment_id: shipmentId,
            };
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/courier/assign/awb`, { shipment_id: shipmentId, courier_id: courierId }, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            return response.data.response.data;
        }
        catch (error) {
            console.error('Shiprocket AWB Generation Failed:', JSON.stringify(error.response?.data || error.message, null, 2));
            throw new AppError_1.AppError('Failed to generate AWB', 502);
        }
    }
}
exports.shiprocketService = new ShiprocketService();
//# sourceMappingURL=shiprocket.service.js.map