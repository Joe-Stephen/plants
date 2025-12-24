import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  // Warn or throw? For dev, warn.
  console.warn('Razorpay keys not found in environment variables.');
}

let razorpayInstance: any;

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('Razorpay keys not found. Using MOCK instance.');
  razorpayInstance = {
    orders: {
      create: async (options: any) => ({
        id: 'order_' + Date.now(),
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
      }),
    },
  };
} else {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const instance = razorpayInstance;
