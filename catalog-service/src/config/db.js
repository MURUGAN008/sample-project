require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[Catalog DB] Connected successfully!");
    } catch (e) {
        console.error("[Catalog DB Error]:", e.message);
    }
};

module.exports = connectDB;
