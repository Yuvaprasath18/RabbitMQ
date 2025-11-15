const amqp = require('amqplib');

async function publishMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "logs";

  await channel.assertExchange(exchange, "fanout", { durable: false });

  const message = process.argv.slice(2).join(" ") || "Hello Subscribers!";
  channel.publish(exchange, "", Buffer.from(message));

  console.log("Sent:", message);

  await channel.close();
  await connection.close();
}

publishMessage();
