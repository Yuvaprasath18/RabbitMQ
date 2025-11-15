const amqp = require('amqplib');

async function sendMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "hello";
  const message = process.argv.slice(2).join(" ") || "Hello World";

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log("Sent:", message);

  await channel.close();
  await connection.close();
}

sendMessage();
