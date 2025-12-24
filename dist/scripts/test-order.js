"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const API_URL = 'http://localhost:3000';
let token = '';
let addressId = 0;
let razorpayOrderId = '';
let razorpayPaymentId = 'pay_' + Date.now();
const RAZORPAY_SECRET = 'test_secret';
const login = async () => {
    try {
        const res = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'user@example.com',
            password: 'password123'
        });
        token = res.data.token;
        console.log('Login: Success');
    }
    catch (error) {
        console.error('Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};
const setupCartAndAddress = async () => {
    try {
        const resAddr = await axios_1.default.post(`${API_URL}/addresses`, {
            street: '789 Palm Way',
            city: 'Tropical City',
            state: 'FL',
            zip: '33333',
            country: 'USA'
        }, { headers: { Authorization: `Bearer ${token}` } });
        addressId = resAddr.data.data.address.id;
        console.log('Address Created:', addressId);
        await axios_1.default.post(`${API_URL}/cart`, {
            productId: 1,
            quantity: 1
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Cart Item Added');
    }
    catch (error) {
        console.error('Setup Failed:', error.response?.data || error.message);
    }
};
const createOrder = async () => {
    try {
        console.log('Creating Order...');
        const res = await axios_1.default.post(`${API_URL}/orders`, {
            addressId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        razorpayOrderId = data.razorpayOrderId;
        console.log('Order Created. Razorpay Order ID:', razorpayOrderId);
        console.log('Order Amount:', data.amount);
    }
    catch (error) {
        console.error('Create Order Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};
const verifyPayment = async () => {
    try {
        console.log('Verifying Payment...');
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const signature = crypto_1.default
            .createHmac('sha256', RAZORPAY_SECRET)
            .update(body)
            .digest('hex');
        const res = await axios_1.default.post(`${API_URL}/orders/verify`, {
            razorpayOrderId,
            razorpayPaymentId,
            signature
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const order = res.data.data.order;
        if (order.status === 'PAID') {
            console.log('Payment Verification: Success (Status: PAID)');
        }
        else {
            console.error('Payment Verification: Failed (Status not PAID)', order.status);
        }
    }
    catch (error) {
        console.error('Verify Payment Failed:', error.response?.data || error.message);
    }
};
const run = async () => {
    await login();
    await setupCartAndAddress();
    await createOrder();
    await verifyPayment();
};
run();
//# sourceMappingURL=test-order.js.map