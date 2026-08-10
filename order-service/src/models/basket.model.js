const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
    cakeId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 }
});

const basketSchema = new mongoose.Schema({
    customerId: { type: String, required: true, unique: true, index: true },
    items: [basketItemSchema],
    totalAmount: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Basket', basketSchema);
