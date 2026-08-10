require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Target service URLs from environment
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://127.0.0.1:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://127.0.0.1:3002';
const RATING_SERVICE_URL = process.env.RATING_SERVICE_URL || 'http://127.0.0.1:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:3004';

// Gateway Health Check Route
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'api-gateway',
        timestamp: new Date()
    });
});

// Proxy Rules (Using pathFilter to preserve full /api/... URLs)
app.use(createProxyMiddleware({
    pathFilter: '/api/cakes',
    target: CATALOG_SERVICE_URL,
    changeOrigin: true
}));

app.use(createProxyMiddleware({
    pathFilter: ['/api/basket', '/api/checkout', '/api/orders'],
    target: ORDER_SERVICE_URL,
    changeOrigin: true
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/ratings',
    target: RATING_SERVICE_URL,
    changeOrigin: true
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/notifications',
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`[API Gateway] Running on port ${PORT}`);
    console.log(`[API Gateway] Routing /api/cakes ➔ ${CATALOG_SERVICE_URL}`);
    console.log(`[API Gateway] Routing /api/basket & /api/checkout ➔ ${ORDER_SERVICE_URL}`);
    console.log(`[API Gateway] Routing /api/ratings ➔ ${RATING_SERVICE_URL}`);
    console.log(`[API Gateway] Routing /api/notifications ➔ ${NOTIFICATION_SERVICE_URL}`);
});

