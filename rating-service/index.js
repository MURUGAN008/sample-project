require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const ratingRoutes = require('./src/routes/rating.routes');
const seedRatingsIfEmpty = require('./src/config/seed');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'rating-service',
        timestamp: new Date()
    });
});

// API Routes
app.use('/api', ratingRoutes);

connectDB().then(async () => {
    await seedRatingsIfEmpty();
    app.listen(PORT, () => {
        console.log(`[Rating Service] Running on port ${PORT}`);
    });
});
