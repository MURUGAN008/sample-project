require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const connectRabbitMQConsumer = require('./src/config/rabbitmq');
const notificationRoutes = require('./src/routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'notification-service',
        timestamp: new Date()
    });
});

// API Routes
app.use('/api', notificationRoutes);

connectDB().then(async () => {
    await connectRabbitMQConsumer();
    app.listen(PORT, () => {
        console.log(`[Notification Service] Running on port ${PORT}`);
    });
});
