// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:3000';
let token = '';

const login = async () => {
  try {
    const email = `test_ship_rates_${Date.now()}@example.com`;
    const password = 'password123';

    await axios.post(`${API_URL}/auth/signup`, {
      name: 'Shipping Rates Test User',
      email,
      password,
    });

    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    token = (res.data as any).token;
    console.log('Login Success');
  } catch (error: any) {
    console.error('Login Failed:', error.message);
    process.exit(1);
  }
};

const testRates = async () => {
  try {
    console.log('Fetching Shipping Rates...');
    const res = await axios.post(
      `${API_URL}/shipping/rates`,
      {
        pickup_pincode: 110001,
        delivery_pincode: 560001,
        weight: 1.3,
        length: 10,
        breadth: 10,
        height: 10,
        cod: true,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    console.log('Rates Recieved:', res.data.data.length, 'couriers');

    if (res.data.data.length > 0) {
      console.log('Top Courier:', res.data.data[0]);
      // Verify sorting: First should have lower or equal rate than last
      const first = res.data.data[0];
      const last = res.data.data[res.data.data.length - 1];
      console.log('Cheapest Rate:', first.rate);
      console.log('Expensive Rate:', last.rate);

      if (first.rate <= last.rate) {
        console.log('Sorting Verified: TRUE');
      } else {
        console.error('Sorting Verified: FALSE');
      }
    }
  } catch (error: any) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
};

const run = async () => {
  await login();
  await testRates();
};

run();
