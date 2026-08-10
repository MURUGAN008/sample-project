const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/order_db';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[Order DB] Connected successfully!");
    } catch (e) {
        console.error("[Order DB Error]:", e.message);
        process.exit(1);
    }
};

module.exports = connectDB;
