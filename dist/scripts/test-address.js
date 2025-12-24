"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
let token = '';
let address1Id = 0;
let address2Id = 0;
const login = async () => {
    try {
        const res = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: 'user@example.com',
            password: 'password123'
        });
        token = res.data.token;
        console.log('Login: Success');
    }
    catch (error) {
        console.error('Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
};
const createAddress1 = async () => {
    try {
        console.log('Creating Address 1 (Default)...');
        const res = await axios_1.default.post(`${API_URL}/addresses`, {
            street: '123 Green St',
            city: 'Plant City',
            state: 'FL',
            zip: '33563',
            country: 'USA',
            is_default: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        address1Id = res.data.data.address.id;
        console.log('Create Address 1: Success', address1Id);
    }
    catch (error) {
        console.error('Create Address 1 Failed:', error.response?.data || error.message);
    }
};
const createAddress2 = async () => {
    try {
        console.log('Creating Address 2 (Non-default)...');
        const res = await axios_1.default.post(`${API_URL}/addresses`, {
            street: '456 Cactus Ln',
            city: 'Desert Town',
            state: 'AZ',
            zip: '85001',
            country: 'USA'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        address2Id = res.data.data.address.id;
        console.log('Create Address 2: Success', address2Id);
    }
    catch (error) {
        console.error('Create Address 2 Failed:', error.response?.data || error.message);
    }
};
const verifyDefault = async () => {
    try {
        const res = await axios_1.default.get(`${API_URL}/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const addresses = res.data.data.addresses;
        const addr1 = addresses.find((a) => a.id === address1Id);
        const addr2 = addresses.find((a) => a.id === address2Id);
        if (addr1?.is_default && !addr2?.is_default) {
            console.log('Verify Default (Initial): Passed');
        }
        else {
            console.error('Verify Default (Initial): Failed', addresses);
        }
    }
    catch (error) {
        console.error('List Addresses Failed:', error.response?.data || error.message);
    }
};
const updateDefault = async () => {
    try {
        console.log('Updating Address 2 to Default...');
        await axios_1.default.put(`${API_URL}/addresses/${address2Id}`, {
            is_default: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const res = await axios_1.default.get(`${API_URL}/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const addresses = res.data.data.addresses;
        const addr1 = addresses.find((a) => a.id === address1Id);
        const addr2 = addresses.find((a) => a.id === address2Id);
        if (!addr1?.is_default && addr2?.is_default) {
            console.log('Verify Default (After Update): Passed');
        }
        else {
            console.error('Verify Default (After Update): Failed', addresses);
        }
    }
    catch (error) {
        console.error('Update Address Failed:', error.response?.data || error.message);
    }
};
const deleteAddress = async () => {
    try {
        console.log('Deleting Address 1...');
        await axios_1.default.delete(`${API_URL}/addresses/${address1Id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Delete Address 1: Success');
    }
    catch (error) {
        console.error('Delete Address Failed:', error.response?.data || error.message);
    }
};
const run = async () => {
    await login();
    await createAddress1();
    await createAddress2();
    await verifyDefault();
    await updateDefault();
    await deleteAddress();
};
run();
//# sourceMappingURL=test-address.js.map