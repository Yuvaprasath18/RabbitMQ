const amqp = require('amqplib');

async function receiveMessages() {
  const connection = await amqp.connect("amqp://guest:guest@127.0.0.1");
  const channel = await connection.createChannel();
  const queue = "task_queue";

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1); 

  console.log("Waiting for messages...");

  channel.consume(queue, (msg) => {
    const task = msg.content.toString();
    console.log("Received:", task);

    setTimeout(() => {
      console.log("Done:", task);
      channel.ack(msg);
    }, 2000);
  });
}

receiveMessages();
