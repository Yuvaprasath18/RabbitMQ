const amqp = require('amqplib');

async function subscribeTopic() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "topic_logs";

  await channel.assertExchange(exchange, "topic", { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: node receive.js <binding_pattern>");
    process.exit(1);
  }

  for (const key of args) {
    await channel.bindQueue(q.queue, exchange, key);
  }

  console.log("Waiting for topic messages...");

  channel.consume(q.queue, (msg) => {
    console.log(`Received '${msg.fields.routingKey}':'${msg.content.toString()}'`);
  }, { noAck: true });
}

subscribeTopic();
