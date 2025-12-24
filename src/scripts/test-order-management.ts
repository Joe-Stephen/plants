// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:3000';
let userToken = '';
let adminToken = '';
let orderId = 0;

const loginUser = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'user@example.com',
            password: 'password123' 
        });
        userToken = (res.data as any).token;
        console.log('User Login: Success');
    } catch (error: any) {
        console.error('User Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

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

const setupOrder = async () => {
    try {
         // Create dummy order using existing logic (Assuming Address 1 exists from previous runs)
         // Create Address first
         const addrRes = await axios.post(`${API_URL}/addresses`, {
            street: '123 Order St',
            city: 'Test City',
            state: 'TS',
            zip: '12345',
            country: 'Testland'
         }, { headers: { Authorization: `Bearer ${userToken}` }});
         const addressId = (addrRes.data as any).data.address.id;

         // First, add item to cart
         await axios.post(`${API_URL}/cart`, { productId: 1, quantity: 1 }, { headers: { Authorization: `Bearer ${userToken}` }});
         
         // Create Order
         const res = await axios.post(`${API_URL}/orders`, { addressId }, { headers: { Authorization: `Bearer ${userToken}` }});
         orderId = (res.data as any).data.orderId;
         console.log('Order Created:', orderId);
    } catch (error: any) {
        // If Address 1 doesn't exist, this might fail unless we create it. 
        // For robustness, let's just log. If it fails, subsequent tests fail.
        console.error('Setup Order Failed (Make sure Address 1 and Product 1 exist):', error.response?.data || error.message);
    }
};

const listUserOrders = async () => {
    try {
        const res = await axios.get(`${API_URL}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const orders = (res.data as any).data.orders;
        if (Array.isArray(orders)) {
            console.log('List User Orders: Success (Count:', orders.length, ')');
        } else {
            console.error('List User Orders: Failed (Invalid format)');
        }
    } catch (error: any) {
        console.error('List User Orders Error:', error.response?.data || error.message);
    }
};

const getOrderDetails = async () => {
    try {
        const res = await axios.get(`${API_URL}/orders/${orderId}`, {
             headers: { Authorization: `Bearer ${userToken}` }
        });
        const order = (res.data as any).data.order;
        if (order && order.id === orderId) {
             console.log('Get Order Details: Success');
        } else {
             console.error('Get Order Details: Failed');
        }
    } catch (error: any) {
         console.error('Get Order Details Error:', error.response?.data || error.message);
    }
};

const listAllOrdersAdmin = async () => {
    try {
        const res = await axios.get(`${API_URL}/orders/admin/all`, {
             headers: { Authorization: `Bearer ${adminToken}` }
        });
        const orders = (res.data as any).data.orders;
        if (Array.isArray(orders) && orders.length > 0) {
             console.log('Admin List All Orders: Success');
        } else {
             console.error('Admin List All Orders: Failed or Empty');
        }
    } catch (error: any) {
         console.error('Admin List Error:', error.response?.data || error.message);
    }
};

const updateStatusAdmin = async () => {
    try {
        const res = await axios.put(`${API_URL}/orders/${orderId}/status`, {
            status: 'SHIPPED'
        }, {
             headers: { Authorization: `Bearer ${adminToken}` }
        });
        const order = (res.data as any).data.order;
        if (order.status === 'SHIPPED') {
             console.log('Admin Update Status: Success');
        } else {
             console.error('Admin Update Status: Failed', order.status);
        }
    } catch (error: any) {
         console.error('Admin Update Status Error:', error.response?.data || error.message);
    }
};

const run = async () => {
    await loginUser();
    await loginAdmin();
    // Re-using exiting data would be better, but lets try to setup one order
    await setupOrder(); 
    await listUserOrders();
    await getOrderDetails();
    await listAllOrdersAdmin();
    await updateStatusAdmin();
};

run();
