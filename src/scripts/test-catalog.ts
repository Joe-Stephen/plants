// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:3000';
let adminToken = '';

const loginAdmin = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        adminToken = (res.data as any).token;
        console.log('Admin Login: Success');
    } catch (error: any) {
        console.error('Admin Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

const testCategory = async () => {
    try {
        console.log('Testing Create Category...');
        const res = await axios.post(`${API_URL}/categories`, {
            name: 'Exotic Plants',
            description: 'Rare and exotic'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Create Category: Success', (res.data as any).data.category.id);
        return (res.data as any).data.category.id;
    } catch (error: any) {
        console.error('Create Category Failed:', error.response?.data || error.message);
    }
};

const run = async () => {
    await loginAdmin();
    await testCategory();
    
    console.log('Testing Get Products...');
    const res = await axios.get(`${API_URL}/products`);
    console.log('Get Products:', res.status, 'Count:', (res.data as any).data.metadata.total);
};

run();
