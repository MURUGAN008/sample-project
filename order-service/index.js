require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { connectRabbitMQ } = require('./src/config/rabbitmq');
const basketRoutes = require('./src/routes/basket.routes');
const orderRoutes = require('./src/routes/order.routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'order-service',
        timestamp: new Date()
    });
});

// API Routes
app.use('/api', basketRoutes);
app.use('/api', orderRoutes);

connectDB().then(async () => {
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`[Order Service] Running on port ${PORT}`);
    });
});
