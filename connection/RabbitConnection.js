const amqp = require("amqplib");

const servers = [
  "amqp://localhost:5672",
  "amqp://localhost:5673",
  "amqp://localhost:5674"
];

async function getConnection() {
  for (const server of servers) {
    try {
      console.log("Trying:", server);
      const conn = await amqp.connect(server);
      console.log("Connected to:", server);
      return conn;
    } catch (err) {
      console.log("Failed:", server);
    }
  }
  throw new Error("RabbitMq servers are not working");
}

module.exports = getConnection;
