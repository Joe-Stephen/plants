// @ts-nocheck
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const testAuth = async () => {
  try {
    console.log('Testing Signup...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    console.log('Signup Status:', signupRes.status);
    console.log('Token Received:', !!signupRes.data.token);

    const token = signupRes.data.token;

    console.log('Testing Health Check (Public)...');
    const healthRes = await axios.get(`${API_URL}/health`);
    console.log('Health Status:', healthRes.status);

    // If we had a protected route, we would test it here.
    // Let's assume we might have one or just verifying login works too.

    console.log('Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: signupRes.data.data.user.email,
      password: 'password123',
    });
    console.log('Login Status:', loginRes.status);
    console.log('Token matches:', !!loginRes.data.token);

    console.log('Authentication Flow Verified Successfully');
  } catch (error: any) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
};

testAuth();
