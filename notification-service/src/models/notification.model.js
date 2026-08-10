const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    orderId: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true },
    channel: { type: String, default: 'EMAIL' },
    status: { type: String, default: 'SENT' },
    message: { type: String },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
