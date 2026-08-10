const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/notification_db';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[Notification DB] Connected successfully!");
    } catch (e) {
        console.error("[Notification DB Error]:", e.message);
        process.exit(1);
    }
};

module.exports = connectDB;
