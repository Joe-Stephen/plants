"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
let guestSessionId = 'guest-' + Date.now();
let adminToken = '';
let productId = 1;
const loginAdmin = async () => {
    try {
        const res = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        adminToken = res.data.token;
        console.log('Admin Login: Success');
    }
    catch (error) {
        console.error('Admin Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};
const testGuestCart = async () => {
    try {
        console.log('Testing Guest Add to Cart...');
        const res = await axios_1.default.post(`${API_URL}/cart`, {
            productId,
            quantity: 2
        }, {
            headers: { 'x-session-id': guestSessionId }
        });
        console.log('Guest Add to Cart: Success', res.data.data.cart.items.length, 'items');
    }
    catch (error) {
        console.error('Guest Add to Cart Failed:', error.response?.data || error.message);
    }
};
const testMergeCart = async () => {
    try {
        console.log('Testing Merge Cart...');
        const res = await axios_1.default.post(`${API_URL}/cart/merge`, {
            sessionId: guestSessionId
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Merge Cart: Success', res.data.data.cart.items.length, 'items');
    }
    catch (error) {
        console.error('Merge Cart Failed:', error.response?.data || error.message);
    }
};
const run = async () => {
    await testGuestCart();
    await loginAdmin();
    await testMergeCart();
    try {
        const res = await axios_1.default.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const items = res.data.data.cart.items;
        console.log('User Cart Count:', items.length);
        if (items.length > 0) {
            console.log('Cart Verification Passed');
        }
        else {
            console.error('Cart Verification Failed: User cart is empty');
        }
    }
    catch (error) {
        console.error('Get User Cart Failed:', error.response?.data || error.message);
    }
};
run();
//# sourceMappingURL=test-cart.js.map