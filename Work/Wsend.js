const amqp = require("amqplib");

async function sendMessage() {
  const connection = await amqp.connect("amqp://guest:guest@127.0.0.1");
  const channel = await connection.createChannel();
  const queue = "task_queue";

  await channel.assertQueue(queue, { durable: true });

  const message = "Hello Task!";
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  console.log("Sent:", message);

  await channel.close();
  await connection.close();
}

sendMessage();
