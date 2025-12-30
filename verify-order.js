const http = require('http');

const request = (method, path, data, token) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const run = async () => {
  try {
    // 1. Login
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    console.log('1. Signup/Login...');
    // Create User
    const signupRes = await request('POST', '/auth/signup', {
      name: 'Order Tester',
      email,
      password,
    });

    if (signupRes.status >= 400) {
      console.error('Signup failed:', JSON.stringify(signupRes.body, null, 2));
      // Try login just in case
    }

    // Login to get token
    const loginRes = await request('POST', '/auth/login', { email, password });
    const token = loginRes.body.token || signupRes.body.token; // Fallback

    if (!token) throw new Error('No token obtained');
    console.log('   Token obtained');

    // 2. Add Address
    console.log('2. Add Address...');
    const addressData = {
      street: '123 Green St',
      city: 'Plant City',
      state: 'Leaf State',
      zip: '12345',
      country: 'India',
    };
    const addAddressRes = await request(
      'POST',
      '/addresses',
      addressData,
      token,
    );

    let addressId;
    if (addAddressRes.body?.data?.address) {
      addressId = addAddressRes.body.data.address.id;
    }

    if (!addressId)
      throw new Error(
        'Could not create address: ' + JSON.stringify(addAddressRes.body),
      );
    console.log('   Address ID:', addressId);

    // 3. Create Order
    console.log(`3. Create Order (Address ID: ${addressId})...`);

    console.log('   Adding item to cart first...');
    const productsRes = await request('GET', '/products');
    let productId = 8;
    if (productsRes.body?.data?.products?.length) {
      productId = productsRes.body.data.products[0].id; // Use first product
    }
    console.log('   Using Product ID:', productId);

    await request('POST', '/cart', { productId, quantity: 1 }, token);
    console.log('   Item added to cart');

    const createOrderRes = await request(
      'POST',
      '/orders',
      { addressId },
      token,
    );
    console.log(
      '   Create Order Response:',
      JSON.stringify(createOrderRes.body, null, 2),
    );
    console.log('   Status:', createOrderRes.status);
  } catch (err) {
    console.error('Error:', err);
  }
};

run();
