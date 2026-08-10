const Order = require('../models/order.model');
const Basket = require('../models/basket.model');
const { publishOrderCompleted } = require('../config/rabbitmq');

// POST /api/checkout - Complete checkout, save order, clear basket, publish RabbitMQ event
const processCheckout = async (req, res) => {
    try {
        const { customerId, customerName, customerEmail } = req.body;

        if (!customerId || !customerName || !customerEmail) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing: customerId, customerName, customerEmail"
            });
        }

        const basket = await Basket.findOne({ customerId });
        if (!basket || basket.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Shopping basket is empty. Cannot checkout."
            });
        }

        // 1. Create order
        const order = await Order.create({
            customerName,
            customerEmail,
            items: basket.items,
            totalAmount: basket.totalAmount,
            status: 'COMPLETED'
        });

        // 2. Clear customer basket
        basket.items = [];
        basket.totalAmount = 0;
        await basket.save();

        // 3. Publish OrderCompleted event to RabbitMQ
        await publishOrderCompleted(order);

        return res.status(201).json({
            success: true,
            message: "Checkout successful! Order created and notification event published.",
            data: order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// GET /api/orders/:orderId - Get single order details
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    processCheckout,
    getOrderById
};
