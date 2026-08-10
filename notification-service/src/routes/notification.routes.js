const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getNotificationByOrderId
} = require('../controllers/notification.controller');

router.get('/notifications', getNotifications);
router.get('/notifications/order/:orderId', getNotificationByOrderId);

module.exports = router;
