"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
let token = '';
const login = async () => {
    try {
        const email = `test_ship_${Date.now()}@example.com`;
        const password = 'password123';
        await axios_1.default.post(`${API_URL}/auth/signup`, {
            name: 'Shipping Test User',
            email,
            password,
        });
        const res = await axios_1.default.post(`${API_URL}/auth/login`, { email, password });
        token = res.data.token;
        console.log('Login Success');
    }
    catch (error) {
        console.error('Login Failed:', error.message);
        process.exit(1);
    }
};
const testServiceability = async () => {
    try {
        console.log('Testing Serviceability (First Call - Uncached)...');
        const start = Date.now();
        const res = await axios_1.default.post(`${API_URL}/shipping/serviceability`, {
            pickup_pincode: 110001,
            delivery_pincode: 560001,
            weight: 1,
            length: 10,
            breadth: 10,
            height: 10,
            cod: true,
        }, { headers: { Authorization: `Bearer ${token}` } });
        const end = Date.now();
        console.log(`Response Time: ${end - start}ms`);
        console.log('Data:', res.data.data);
        console.log('Testing Serviceability (Second Call - Cached)...');
        const start2 = Date.now();
        const res2 = await axios_1.default.post(`${API_URL}/shipping/serviceability`, {
            pickup_pincode: 110001,
            delivery_pincode: 560001,
            weight: 1,
            length: 10,
            breadth: 10,
            height: 10,
            cod: true,
        }, { headers: { Authorization: `Bearer ${token}` } });
        const end2 = Date.now();
        console.log(`Response Time: ${end2 - start2}ms`);
        console.log('Data Match:', JSON.stringify(res.data.data) === JSON.stringify(res2.data.data));
        if (end2 - start2 < end - start) {
            console.log('Cache Verification: Potentially faster (local env variability applies).');
        }
    }
    catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};
const run = async () => {
    await login();
    await testServiceability();
};
run();
//# sourceMappingURL=test-shipping.js.map