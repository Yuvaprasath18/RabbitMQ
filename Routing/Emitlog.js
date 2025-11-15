const amqp = require('amqplib');

async function publishMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "direct_logs";

  await channel.assertExchange(exchange, "direct", { durable: false });

  const args = process.argv.slice(2);
  const severity = args[0] || "info"; 
  const message = args.slice(1).join(' ') || "Hello from Direct Exchange!";
  channel.publish(exchange, severity, Buffer.from(message));
  console.log(`Sent '${severity}': '${message}'`);

  await channel.close();
  await connection.close();
}

publishMessage();
