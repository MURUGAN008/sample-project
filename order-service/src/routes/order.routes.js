const express = require('express');
const router = express.Router();
const { processCheckout, getOrderById } = require('../controllers/order.controller');

router.post('/checkout', processCheckout);
router.get('/orders/:orderId', getOrderById);

module.exports = router;
