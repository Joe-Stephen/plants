"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const shiprocket_service_1 = require("./services/shiprocket.service");
const shiprocketAuth_service_1 = require("./services/shiprocketAuth.service");
const axios_1 = __importDefault(require("axios"));
async function test() {
    try {
        console.log('Authenticating...');
        const token = await shiprocketAuth_service_1.shiprocketAuthService.getToken();
        console.log('Token:', token);
        console.log('Fetching pickup locations...');
        const locations = await shiprocket_service_1.shiprocketService.getPickupLocations();
        console.log('Locations:', JSON.stringify(locations, null, 2));
        const pickupLoc = locations.data.shipping_address[0]
            .pickup_location;
        console.log('Using Pickup Location:', pickupLoc);
        const payload = {
            order_id: 'TEST_ORDER_' + Date.now(),
            order_date: new Date().toISOString(),
            pickup_location: pickupLoc,
            billing_customer_name: 'Joe',
            billing_last_name: 'Stephen',
            billing_address: 'Kanjirathinkal House, Elanad, Thrissur',
            billing_city: 'Thrissur',
            billing_pincode: '680586',
            billing_state: 'Kerala',
            billing_country: 'India',
            billing_email: 'joestephenk10@gmail.com',
            billing_phone: '9999999999',
            shipping_is_billing: true,
            order_items: [
                {
                    name: 'test',
                    sku: '11',
                    units: 1,
                    selling_price: '100.00',
                    discount: '',
                    tax: '',
                    hsn: '',
                },
            ],
            payment_method: 'Prepaid',
            shipping_charges: '97.00',
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: '197.00',
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5,
        };
        console.log('Creating order...');
        const url = 'https://apiv2.shiprocket.in/v1/external/orders/create/ad_hoc';
        console.log('URL:', url);
        try {
            const res = await axios_1.default.post(url, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Success:', res.data);
        }
        catch (e) {
            console.error('Direct Axios Failed:', e.response?.status, e.response?.data);
        }
        try {
            const res2 = await shiprocket_service_1.shiprocketService.createOrder(payload);
            console.log('Service Success:', res2);
        }
        catch (e) {
            console.error('Service Failed:', e.message);
        }
        console.log('Testing Alternative URL: /orders/create/quick');
        const url2 = 'https://apiv2.shiprocket.in/v1/external/orders/create/quick';
        try {
            const res3 = await axios_1.default.post(url2, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Alternative Success:', res3.data);
        }
        catch (e) {
            console.error('Alternative Direct Axios Failed:', e.response?.status, e.response?.data);
        }
        console.log('Testing List Orders: /orders');
        try {
            const res4 = await axios_1.default.get('https://apiv2.shiprocket.in/v1/external/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('List Orders Success (Count):', res4.data?.data?.length || 0);
        }
        catch (e) {
            console.error('List Orders Failed:', e.response?.status);
        }
        console.log('Testing URL without underscored ad_hoc: /orders/create/adhoc');
        try {
            const res5 = await axios_1.default.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Adhoc (no underscore) Success:', res5.data);
        }
        catch (e) {
            console.error('Adhoc (no underscore) Failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
        }
    }
    catch (error) {
        console.error('Top level error:', error);
    }
}
test();
//# sourceMappingURL=reproduce_shiprocket_404.js.map