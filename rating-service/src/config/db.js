const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27019/rating_db';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[Rating DB] Connected successfully!");
    } catch (e) {
        console.error("[Rating DB Error]:", e.message);
        process.exit(1);
    }
};

module.exports = connectDB;
