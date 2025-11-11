const amqp = require('amqplib');

async function startServer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = 'rpc_queue';

    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);
    console.log(" Awaiting RPC requests");

    channel.consume(queue, async (msg) => {
        const n = parseInt(msg.content.toString());
        console.log(" fib(%d)", n);

        const result = fibonacci(n);

        channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(result.toString()),
            { correlationId: msg.properties.correlationId }
        );

        channel.ack(msg);
    });
}

function fibonacci(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

startServer();
