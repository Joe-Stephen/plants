// @ts-nocheck
import axios from 'axios';
import crypto from 'crypto';

const API_URL = 'http://localhost:3000';
let token = '';
let addressId = 0;
let razorpayOrderId = '';
let razorpayPaymentId = 'pay_' + Date.now();
// Mock secret matching the one in config/razorpay.ts (fallback 'test_secret')
// In real app, this secret comes from env.
const RAZORPAY_SECRET = '2mQ3bTgnaNMZFSRSx4GfATHG';

const login = async () => {
  try {
    const email = `test_order_${Date.now()}@example.com`;
    const password = 'password123';

    // Register
    await axios.post(`${API_URL}/auth/signup`, {
      name: 'Test Order User',
      email,
      password,
    });
    console.log('Registered new user:', email);

    // Login
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    token = (res.data as any).token;
    console.log('Login: Success');
  } catch (error: any) {
    console.error(
      'Login/Signup Failed:',
      error.response?.data || error.message,
    );
    process.exit(1);
  }
};

const setupCartAndAddress = async () => {
  try {
    // 1. Create Address
    const resAddr = await axios.post(
      `${API_URL}/addresses`,
      {
        street: '789 Palm Way',
        city: 'Tropical City',
        state: 'FL',
        zip: '33333',
        country: 'USA',
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    addressId = (resAddr.data as any).data.address.id;
    console.log('Address Created:', addressId);

    // 2. Add Item to Cart
    await axios.post(
      `${API_URL}/cart`,
      {
        productId: 7,
        quantity: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log('Cart Item Added');
  } catch (error: any) {
    console.error('Setup Failed:', error.response?.data || error.message);
  }
};

const createOrder = async () => {
  try {
    console.log('Creating Order...');
    const res = await axios.post(
      `${API_URL}/orders`,
      {
        addressId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = (res.data as any).data;
    razorpayOrderId = data.razorpayOrderId;
    console.log('Order Created. Razorpay Order ID:', razorpayOrderId);
    console.log('Order Amount:', data.amount);
    console.log('Shipping Cost:', data.shippingCost || 'N/A');
    console.log('Estimated Delivery:', data.estimatedDeliveryDate || 'N/A');
  } catch (error: any) {
    console.error(
      'Create Order Failed:',
      error.response?.data || error.message,
    );
    process.exit(1);
  }
};

const verifyPayment = async () => {
  try {
    console.log('Verifying Payment...');

    // Generate valid signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const signature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    const res = await axios.post(
      `${API_URL}/orders/verify`,
      {
        razorpayOrderId,
        razorpayPaymentId,
        signature,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const order = (res.data as any).data.order;
    if (order.status === 'PAID') {
      console.log('Payment Verification: Success (Status: PAID)');
      console.log('Shiprocket Order ID:', order.shiprocketOrderId);
      console.log('Shipment ID:', order.shiprocketShipmentId);
      console.log('AWB Code:', order.awbCode || 'Pending');
      console.log('Tracking URL:', order.trackingUrl || 'Pending');
    } else {
      console.log(
        'Payment Verification: Failed (Status not PAID)',
        order.status,
      );
    }
  } catch (error: any) {
    console.error(
      'Verify Payment Failed:',
      error.response?.data || error.message,
    );
  }
};

const run = async () => {
  await login();
  await setupCartAndAddress();
  await createOrder();
  await verifyPayment();
};

run();
