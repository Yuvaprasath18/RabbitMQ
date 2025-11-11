const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function rpcCall(n) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const q = await channel.assertQueue('', { exclusive: true }); 
    const correlationId = uuidv4();

    console.log(` Requesting fib(${n})`);

    channel.consume(
        q.queue,
        (msg) => {
            if (msg.properties.correlationId === correlationId) {
                console.log(`Got ${msg.content.toString()}`);
                connection.close();
            }
        },
        { noAck: true }
    );

    channel.sendToQueue('rpc_queue', Buffer.from(n.toString()), {
        correlationId: correlationId,
        replyTo: q.queue
    });
}

rpcCall(6);
