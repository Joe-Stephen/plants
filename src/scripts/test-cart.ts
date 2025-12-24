// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:3000';
let guestSessionId = 'guest-' + Date.now();
let adminToken = '';
let productId = 1; // Assuming product 1 exists from seed

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

const testGuestCart = async () => {
    try {
        console.log('Testing Guest Add to Cart...');
        const res = await axios.post(`${API_URL}/cart`, {
            productId,
            quantity: 2
        }, {
            headers: { 'x-session-id': guestSessionId }
        });
        console.log('Guest Add to Cart: Success', (res.data as any).data.cart.items.length, 'items');
    } catch (error: any) {
        console.error('Guest Add to Cart Failed:', error.response?.data || error.message);
    }
};

const testMergeCart = async () => {
    try {
        console.log('Testing Merge Cart...');
        const res = await axios.post(`${API_URL}/cart/merge`, {
            sessionId: guestSessionId
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Merge Cart: Success', (res.data as any).data.cart.items.length, 'items');
    } catch (error: any) {
        console.error('Merge Cart Failed:', error.response?.data || error.message);
    }
};

const run = async () => {
    // 1. Guest adds item
    await testGuestCart();
    
    // 2. Login
    await loginAdmin();
    
    // 3. Merge
    await testMergeCart();

    // 4. Verify User Cart has items
    try {
        const res = await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const items = (res.data as any).data.cart.items;
        console.log('User Cart Count:', items.length);
        if (items.length > 0) {
            console.log('Cart Verification Passed');
        } else {
             console.error('Cart Verification Failed: User cart is empty');
        }
    } catch (error: any) {
        console.error('Get User Cart Failed:', error.response?.data || error.message);
    }
};

run();
