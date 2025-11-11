const amqp = require('amqplib');

async function receiveMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "hello";

  await channel.assertQueue(queue);
  console.log("Waiting for messages...");

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("Received:", msg.content.toString());
      // channel.ack(msg);
    }
  });
}

receiveMessage();
