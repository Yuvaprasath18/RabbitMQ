const amqp = require("amqplib");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter queue name (default: task_queue): ", async (queue) => {
  queue = queue || "task_queue";

  try {
    const connection = await amqp.connect("amqp://guest:guest@127.0.0.1");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log(`Waiting for messages from "${queue}"...\n`);

    channel.consume(queue, (msg) => {
      const task = msg.content.toString();
      console.log("Received:", task);

      setTimeout(() => {
        console.log("Done:", task);
        channel.ack(msg);
      }, 10000);
    });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    rl.close();
  }
});
