const amqp = require('amqplib');

async function receiveMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "logs";

  await channel.assertExchange(exchange, "fanout", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });
  console.log("Waiting for messages in", q.queue);

  channel.bindQueue(q.queue, exchange, "");

  channel.consume(q.queue, (msg) => {
    if (msg.content) {
      console.log("Received:", msg.content.toString());
    }
  }, { noAck: true });
}

receiveMessage();
