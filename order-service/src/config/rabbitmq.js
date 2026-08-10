const amqp = require('amqplib');

let channel = null;
let connection = null;
const EXCHANGE_NAME = 'cake_events';

const connectRabbitMQ = async () => {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
    try {
        connection = await amqp.connect(rabbitUrl);

        connection.on('error', (err) => {
            console.error(`[RabbitMQ Producer Connection Error]: ${err.message}. Reconnecting...`);
            channel = null;
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on('close', () => {
            console.log('[RabbitMQ Producer Connection Closed]. Reconnecting...');
            channel = null;
            setTimeout(connectRabbitMQ, 5000);
        });

        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        console.log(`[RabbitMQ Producer] Connected & Exchange '${EXCHANGE_NAME}' asserted`);
    } catch (error) {
        console.error(`[RabbitMQ Producer Init Error]: ${error.message}. Retrying in 5s...`);
        setTimeout(connectRabbitMQ, 5000);
    }
};

const publishOrderCompleted = async (orderData) => {
    if (!channel) {
        console.error('[RabbitMQ Producer Error]: Channel not ready to publish message');
        return false;
    }
    const routingKey = 'order.completed';
    const messagePayload = {
        event: 'OrderCompleted',
        orderId: orderData._id || orderData.orderId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        timestamp: new Date().toISOString()
    };

    const published = channel.publish(
        EXCHANGE_NAME,
        routingKey,
        Buffer.from(JSON.stringify(messagePayload)),
        { persistent: true }
    );
    console.log(`[RabbitMQ Producer] Published '${messagePayload.event}' for Order #${messagePayload.orderId}`);
    return published;
};

module.exports = {
    connectRabbitMQ,
    publishOrderCompleted
};

