const amqp = require('amqplib');
const Notification = require('../models/notification.model');
const { sendOrderConfirmationEmail } = require('./email');

const EXCHANGE_NAME = 'cake_events';
const QUEUE_NAME = 'notification_queue';
const ROUTING_KEY = 'order.completed';

let connection = null;

const connectRabbitMQConsumer = async () => {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    try {
        connection = await amqp.connect(rabbitUrl);

        connection.on('error', (err) => {
            console.error(`[RabbitMQ Consumer Connection Error]: ${err.message}. Reconnecting...`);
            setTimeout(connectRabbitMQConsumer, 5000);
        });

        connection.on('close', () => {
            console.log('[RabbitMQ Consumer Connection Closed]. Reconnecting...');
            setTimeout(connectRabbitMQConsumer, 5000);
        });

        const channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

        console.log(`[RabbitMQ Consumer] Bound queue '${QUEUE_NAME}' to exchange '${EXCHANGE_NAME}' on key '${ROUTING_KEY}'`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                try {
                    const eventData = JSON.parse(msg.content.toString());
                    console.log(`[RabbitMQ Consumer] Received Event: '${eventData.event}' for Order #${eventData.orderId}`);

                    // Send Test HTML Email via Ethereal Mailer
                    const emailResult = await sendOrderConfirmationEmail(eventData);

                    const notificationMessage = emailResult.previewUrl
                        ? `Live Email Sent! Preview: ${emailResult.previewUrl}`
                        : `Order confirmation notification sent to ${eventData.customerEmail} for Order #${eventData.orderId} (Total: $${Number(eventData.totalAmount).toFixed(2)})`;

                    await Notification.create({
                        orderId: String(eventData.orderId),
                        customerName: eventData.customerName,
                        customerEmail: eventData.customerEmail,
                        totalAmount: Number(eventData.totalAmount),
                        channel: 'EMAIL',
                        status: 'SENT',
                        message: notificationMessage
                    });

                    console.log(`[Notification Consumer] Successfully processed & saved notification log for Order #${eventData.orderId}`);
                    channel.ack(msg);
                } catch (error) {
                    console.error(`[Notification Consumer Error]: ${error.message}`);
                    channel.nack(msg, false, false);
                }
            }
        });

    } catch (error) {
        console.error(`[RabbitMQ Consumer Init Error]: ${error.message}. Retrying in 5s...`);
        setTimeout(connectRabbitMQConsumer, 5000);
    }
};

module.exports = connectRabbitMQConsumer;




