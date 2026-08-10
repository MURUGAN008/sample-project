const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, default: 10, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

const cakeModel = mongoose.model("Cake", cakeSchema);

module.exports = cakeModel;

