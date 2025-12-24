"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
let adminToken = '';
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
const testCategory = async () => {
    try {
        console.log('Testing Create Category...');
        const res = await axios_1.default.post(`${API_URL}/categories`, {
            name: 'Exotic Plants',
            description: 'Rare and exotic'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Create Category: Success', res.data.data.category.id);
        return res.data.data.category.id;
    }
    catch (error) {
        console.error('Create Category Failed:', error.response?.data || error.message);
    }
};
const run = async () => {
    await loginAdmin();
    await testCategory();
    console.log('Testing Get Products...');
    const res = await axios_1.default.get(`${API_URL}/products`);
    console.log('Get Products:', res.status, 'Count:', res.data.data.metadata.total);
};
run();
//# sourceMappingURL=test-catalog.js.map