const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function verifyAnalytics() {
  try {
    // 1. Login
    console.log('Logging in as Admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'newpassword123',
    });

    const token = loginRes.data.token;
    console.log('Login successful.');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Dashboard Stats
    console.log('\nTesting GET /analytics/dashboard...');
    const dashboardRes = await axios.get(`${API_URL}/analytics/dashboard`, {
      headers,
    });
    console.log(
      'Dashboard Stats:',
      JSON.stringify(dashboardRes.data.data, null, 2),
    );

    // 3. Sales Chart
    console.log('\nTesting GET /analytics/sales-chart...');
    const chartRes = await axios.get(`${API_URL}/analytics/sales-chart`, {
      headers,
    });
    console.log(
      'Sales Chart (First 2):',
      JSON.stringify(chartRes.data.data.slice(0, 2), null, 2),
    );

    // 4. Top Products
    console.log('\nTesting GET /analytics/top-products...');
    const productsRes = await axios.get(`${API_URL}/analytics/top-products`, {
      headers,
    });
    console.log(
      'Top Products (First 2):',
      JSON.stringify(productsRes.data.data.products.slice(0, 2), null, 2),
    );

    // 5. Orders By Status
    console.log('\nTesting GET /analytics/orders-by-status...');
    const statusRes = await axios.get(`${API_URL}/analytics/orders-by-status`, {
      headers,
    });
    console.log(
      'Orders By Status:',
      JSON.stringify(statusRes.data.data, null, 2),
    );

    // 6. Category Sales
    console.log('\nTesting GET /analytics/category-sales...');
    const categoryRes = await axios.get(`${API_URL}/analytics/category-sales`, {
      headers,
    });
    console.log(
      'Category Sales:',
      JSON.stringify(categoryRes.data.data, null, 2),
    );

    // 7. New Users Chart
    console.log('\nTesting GET /analytics/new-users-chart...');
    const userChartRes = await axios.get(
      `${API_URL}/analytics/new-users-chart`,
      { headers },
    );
    console.log(
      'New Users Chart (First 2):',
      JSON.stringify(userChartRes.data.data.slice(0, 2), null, 2),
    );

    // 8. Low Stock
    console.log('\nTesting GET /analytics/low-stock...');
    const lowStockRes = await axios.get(`${API_URL}/analytics/low-stock`, {
      headers,
    });
    console.log(
      'Low Stock:',
      JSON.stringify(lowStockRes.data.data.products.slice(0, 3), null, 2),
    );

    console.log('\nAnalytics Verification Passed!');
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

verifyAnalytics();
