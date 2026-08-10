const Notification = require('../models/notification.model');

// GET /api/notifications - Get all notification history
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ sentAt: -1 });
        return res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// GET /api/notifications/order/:orderId - Get notification log for specific order
const getNotificationByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const notification = await Notification.findOne({ orderId });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification log not found for order" });
        }

        return res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getNotifications,
    getNotificationByOrderId
};
