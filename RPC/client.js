const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

async function rpcCall(n) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const q = await channel.assertQueue('', { exclusive: true });
  const correlationId = uuidv4();

  console.log(`Requesting fib(${n})...`);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.properties.correlationId === correlationId) {
        console.log(`Got result: ${msg.content.toString()}`);
        setTimeout(() => connection.close(), 500);
      }
    },
    { noAck: true }
  );

  channel.sendToQueue(
    'rpc_queue',
    Buffer.from(n.toString()),
    {
      correlationId,
      replyTo: q.queue,
    }
  );
}

const num = process.argv[2] || 6;
rpcCall(num);
