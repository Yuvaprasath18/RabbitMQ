const amqp = require('amqplib');

async function publishTopic() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "topic_logs";

  await channel.assertExchange(exchange, "topic", { durable: false });

  const args = process.argv.slice(2);
  const key = args[0] || "anonymous.info";
  const message = args.slice(1).join(' ') || "Hello from Topic Exchange!";

  channel.publish(exchange, key, Buffer.from(message));
  console.log(`Sent '${key}': '${message}'`);

  await channel.close();
  await connection.close();
}

publishTopic();
