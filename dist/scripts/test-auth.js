"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
const testAuth = async () => {
    try {
        console.log('Testing Signup...');
        const signupRes = await axios_1.default.post(`${API_URL}/auth/signup`, {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
        });
        console.log('Signup Status:', signupRes.status);
        console.log('Token Received:', !!signupRes.data.token);
        const token = signupRes.data.token;
        console.log('Testing Health Check (Public)...');
        const healthRes = await axios_1.default.get(`${API_URL}/health`);
        console.log('Health Status:', healthRes.status);
        console.log('Testing Login...');
        const loginRes = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: signupRes.data.data.user.email,
            password: 'password123',
        });
        console.log('Login Status:', loginRes.status);
        console.log('Token matches:', !!loginRes.data.token);
        console.log('Authentication Flow Verified Successfully');
    }
    catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
};
testAuth();
//# sourceMappingURL=test-auth.js.map