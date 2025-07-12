import crypto from 'crypto';
// Corrected model imports to use capitalized names
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import fetch from 'node-fetch';

// eSewa Test Credentials and URL
const ESEWA_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_SCD = 'EPAYTEST';
const ESEWA_SECRET = '8gBm/:&EnhH.1/q';

// Frontend URLs for redirection
const FRONTEND_SUCCESS_URL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`;
const FRONTEND_FAILURE_URL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`;

/**
 * @desc    Initiate eSewa payment process
 * @route   POST /api/payment/esewa/initiate
 * @access  Private
 */
export const initiateEsewaPayment = async (req, res) => {
    try {
        // 1. Get order details from the request body and the user from the authenticated session
        const { cartItems, phone, address } = req.body;
        const user = await User.findById(req.user._id); // Now 'User' is correctly defined

        if (!user || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Invalid request. User or cart items are missing.' });
        }

        // 2. Calculate totals and prepare order items
        const deliveryFee = 50;
        const serviceCharge = 0;
        const taxAmount = 0;
        let itemsTotal = 0;
        const orderItems = [];
        const productIds = cartItems.map(item => item._id);
        const productsInDb = await Product.find({ '_id': { $in: productIds } }); // 'Product' is correct

        for (const cartItem of cartItems) {
            const product = productsInDb.find(p => p._id.toString() === cartItem._id);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${cartItem._id} not found.` });
            }
            itemsTotal += product.price * cartItem.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                imageUrl: product.imageUrl,
            });
        }

        const finalAmount = itemsTotal + deliveryFee + serviceCharge + taxAmount;
        const transaction_uuid = `hg-${Date.now()}`; // Unique transaction ID

        // 3. Create a new order in the database with 'Pending Payment' status
        const newOrder = new Order({ // 'Order' is correct
            customer: user._id,
            items: orderItems,
            amount: finalAmount,
            address: address,
            phone: phone,
            status: 'Pending Payment',
            paymentMethod: 'eSewa',
            transactionId: transaction_uuid,
        });
        await newOrder.save();

        // 4. Generate the eSewa signature
        const signatureBaseString = `total_amount=${finalAmount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_SCD}`;
        const hmac = crypto.createHmac('sha256', ESEWA_SECRET);
        hmac.update(signatureBaseString);
        const signature = hmac.digest('base64');

        // 5. Prepare the data payload for the eSewa form
        const esewaData = {
            amount: itemsTotal.toString(),
            tax_amount: taxAmount.toString(),
            product_service_charge: serviceCharge.toString(),
            product_delivery_charge: deliveryFee.toString(),
            total_amount: finalAmount.toString(),
            transaction_uuid: transaction_uuid,
            product_code: ESEWA_SCD,
            signature: signature,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
            success_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/esewa/verify`,
            failure_url: `${FRONTEND_FAILURE_URL}?payment=failure`,
        };

        // 6. Send the eSewa data back to the frontend
        res.json({ ...esewaData, esewaUrl: ESEWA_URL });

    } catch (error) {
        console.error('Error in initiateEsewaPayment:', error);
        res.status(500).json({ message: 'Server Error while initiating payment' });
    }
};

/**
 * @desc    Verify eSewa payment after redirection
 * @route   GET /api/payment/esewa/verify
 * @access  Public
 */
export const verifyEsewaPayment = async (req, res) => {
    try {
        const { data } = req.query;
        if (!data) {
            const message = encodeURIComponent('No data received from eSewa.');
            return res.redirect(`${FRONTEND_FAILURE_URL}?payment=failure&message=${message}`);
        }

        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

        if (decodedData.status !== 'COMPLETE') {
            await Order.findOneAndDelete({ transactionId: decodedData.transaction_uuid });
            const message = encodeURIComponent(`Payment was not completed: ${decodedData.status}`);
            return res.redirect(`${FRONTEND_FAILURE_URL}?payment=failure&message=${message}`);
        }

        const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_SCD}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;
        const response = await fetch(verificationUrl);
        const verificationResponse = await response.json();

        if (verificationResponse.status === 'COMPLETE') {
            const order = await Order.findOne({ transactionId: verificationResponse.transaction_uuid }).populate('items');

            if (!order) {
                const message = encodeURIComponent('Order not found for this transaction.');
                return res.redirect(`${FRONTEND_FAILURE_URL}?payment=failure&message=${message}`);
            }

            if (order.status === 'Pending Payment') {
                const user = await User.findById(order.customer);
                let pointsToAward = 0;
                let messageParts = ['Payment successful! Your order has been placed.'];

                const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                if (itemsTotal >= 2000) {
                    pointsToAward = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
                    user.groceryPoints = (user.groceryPoints || 0) + pointsToAward; // Safer addition
                    order.pointsAwarded = pointsToAward;
                    messageParts.push(`You earned ${pointsToAward} Grocery Points.`);
                    console.log(`[eSewa] Awarded ${pointsToAward} points to ${user.email}. New total: ${user.groceryPoints}`);
                }

                await user.save();
                
                order.status = 'Pending';
                await order.save();

                const productUpdates = order.items.map(item => ({
                    updateOne: {
                        filter: { _id: item.product },
                        update: { $inc: { stock: -item.quantity } }
                    }
                }));
                await Product.bulkWrite(productUpdates);

                return res.redirect(`${FRONTEND_SUCCESS_URL}?message=${encodeURIComponent(messageParts.join(' '))}`);
            }

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/orders`);
        } else {
            await Order.findOneAndDelete({ transactionId: decodedData.transaction_uuid });
            const message = encodeURIComponent('Transaction verification failed.');
            return res.redirect(`${FRONTEND_FAILURE_URL}?payment=failure&message=${message}`);
        }

    } catch (error) {
        console.error('Error in verifyEsewaPayment:', error);
        const message = encodeURIComponent('An internal server error occurred during verification.');
        return res.redirect(`${FRONTEND_FAILURE_URL}?payment=failure&message=${message}`);
    }
};