const amqp = require('amqplib');

async function receiveLogs() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "direct_logs";

  await channel.assertExchange(exchange, "direct", { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for logs in queue: ${q.queue}`);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: node recieve [info] [warning] [error]");
    process.exit(1);
  }

  for (const severity of args) {
    await channel.bindQueue(q.queue, exchange, severity);
  }

  channel.consume(q.queue, (msg) => {
    console.log(` Received '${msg.fields.routingKey}':'${msg.content.toString()}'`);
  }, { noAck: true });
}

receiveLogs();
