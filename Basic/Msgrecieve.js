const amqp = require('amqplib');

async function receiveMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "hello";

  await channel.assertQueue(queue, { durable: true });
  console.log("👂 Waiting for messages in queue:", queue);

  channel.consume(queue, (msg) => {
    if (msg) {
      const message = msg.content.toString();
      console.log("Received:", message);

      setTimeout(() => {
        console.log("Done:", message);
        channel.ack(msg);
      }, 10000);
    }
  });
}

receiveMessage();
