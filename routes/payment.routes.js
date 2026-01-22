import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Initialize Razorpay lazily (when needed, not at import time)
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials not found in environment variables');
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// Create Order
router.post('/orders', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const razorpay = getRazorpayInstance(); // Initialize here

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);
        res.json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: 'Razorpay secret not configured' });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            console.log('Payment verified successfully');
            res.json({
                message: "Payment verified successfully",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
        } else {
            console.log('Invalid signature');
            res.status(400).json({ error: "Invalid signature" });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Payment verification failed', details: error.message });
    }
});

export default router;