const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    cakeId: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    ratingScore: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
