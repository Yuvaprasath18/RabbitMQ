const amqp = require('amqplib');

async function startServer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = 'rpc_queue';

  await channel.assertQueue(queue, { durable: false });
  channel.prefetch(1);
  console.log("Awaiting RPC requests...");

  channel.consume(queue, (msg) => {
    const n = parseInt(msg.content.toString());
    console.log(`Received request for fib(${n})`);

    setTimeout(() => {
      const result = fibonacci(n);

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(result.toString()),
        { correlationId: msg.properties.correlationId }
      );

      channel.ack(msg);
      console.log(result);
    }, 10000);
  });
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

startServer();
