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
const RAZORPAY_SECRET = '2mQ3bTgnaNMZFSRSx4GfATHG';
const login = async () => {
    try {
        const email = `test_order_${Date.now()}@example.com`;
        const password = 'password123';
        await axios_1.default.post(`${API_URL}/auth/signup`, {
            name: 'Test Order User',
            email,
            password,
        });
        console.log('Registered new user:', email);
        const res = await axios_1.default.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        token = res.data.token;
        console.log('Login: Success');
    }
    catch (error) {
        console.error('Login/Signup Failed:', error.response?.data || error.message);
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
            country: 'USA',
        }, { headers: { Authorization: `Bearer ${token}` } });
        addressId = resAddr.data.data.address.id;
        console.log('Address Created:', addressId);
        await axios_1.default.post(`${API_URL}/cart`, {
            productId: 7,
            quantity: 1,
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
            addressId,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        razorpayOrderId = data.razorpayOrderId;
        console.log('Order Created. Razorpay Order ID:', razorpayOrderId);
        console.log('Order Amount:', data.amount);
        console.log('Shipping Cost:', data.shippingCost || 'N/A');
        console.log('Estimated Delivery:', data.estimatedDeliveryDate || 'N/A');
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
            signature,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const order = res.data.data.order;
        if (order.status === 'PAID') {
            console.log('Payment Verification: Success (Status: PAID)');
            console.log('Shiprocket Order ID:', order.shiprocketOrderId);
            console.log('Shipment ID:', order.shiprocketShipmentId);
            console.log('AWB Code:', order.awbCode || 'Pending');
            console.log('Tracking URL:', order.trackingUrl || 'Pending');
        }
        else {
            console.log('Payment Verification: Failed (Status not PAID)', order.status);
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