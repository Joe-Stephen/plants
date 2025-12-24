"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
let userToken = '';
let adminToken = '';
let orderId = 0;
const loginUser = async () => {
    try {
        const res = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'user@example.com',
            password: 'password123'
        });
        userToken = res.data.token;
        console.log('User Login: Success');
    }
    catch (error) {
        console.error('User Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};
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
const setupOrder = async () => {
    try {
        const addrRes = await axios_1.default.post(`${API_URL}/addresses`, {
            street: '123 Order St',
            city: 'Test City',
            state: 'TS',
            zip: '12345',
            country: 'Testland'
        }, { headers: { Authorization: `Bearer ${userToken}` } });
        const addressId = addrRes.data.data.address.id;
        await axios_1.default.post(`${API_URL}/cart`, { productId: 1, quantity: 1 }, { headers: { Authorization: `Bearer ${userToken}` } });
        const res = await axios_1.default.post(`${API_URL}/orders`, { addressId }, { headers: { Authorization: `Bearer ${userToken}` } });
        orderId = res.data.data.orderId;
        console.log('Order Created:', orderId);
    }
    catch (error) {
        console.error('Setup Order Failed (Make sure Address 1 and Product 1 exist):', error.response?.data || error.message);
    }
};
const listUserOrders = async () => {
    try {
        const res = await axios_1.default.get(`${API_URL}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const orders = res.data.data.orders;
        if (Array.isArray(orders)) {
            console.log('List User Orders: Success (Count:', orders.length, ')');
        }
        else {
            console.error('List User Orders: Failed (Invalid format)');
        }
    }
    catch (error) {
        console.error('List User Orders Error:', error.response?.data || error.message);
    }
};
const getOrderDetails = async () => {
    try {
        const res = await axios_1.default.get(`${API_URL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const order = res.data.data.order;
        if (order && order.id === orderId) {
            console.log('Get Order Details: Success');
        }
        else {
            console.error('Get Order Details: Failed');
        }
    }
    catch (error) {
        console.error('Get Order Details Error:', error.response?.data || error.message);
    }
};
const listAllOrdersAdmin = async () => {
    try {
        const res = await axios_1.default.get(`${API_URL}/orders/admin/all`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const orders = res.data.data.orders;
        if (Array.isArray(orders) && orders.length > 0) {
            console.log('Admin List All Orders: Success');
        }
        else {
            console.error('Admin List All Orders: Failed or Empty');
        }
    }
    catch (error) {
        console.error('Admin List Error:', error.response?.data || error.message);
    }
};
const updateStatusAdmin = async () => {
    try {
        const res = await axios_1.default.put(`${API_URL}/orders/${orderId}/status`, {
            status: 'SHIPPED'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const order = res.data.data.order;
        if (order.status === 'SHIPPED') {
            console.log('Admin Update Status: Success');
        }
        else {
            console.error('Admin Update Status: Failed', order.status);
        }
    }
    catch (error) {
        console.error('Admin Update Status Error:', error.response?.data || error.message);
    }
};
const run = async () => {
    await loginUser();
    await loginAdmin();
    await setupOrder();
    await listUserOrders();
    await getOrderDetails();
    await listAllOrdersAdmin();
    await updateStatusAdmin();
};
run();
//# sourceMappingURL=test-order-management.js.map