const amqp = require("amqplib");
const EXCHANGE = "direct_logs";
const getConnection = require("../connection/RabbitConnection");

exports.publishMessage = async (req, res) => {
  const { severity = "info", message = "Hello from Developer!" } = req.body;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "direct", { durable: false });
    channel.publish(EXCHANGE, severity, Buffer.from(message));
    await channel.close();
    await connection.close();
    res.status(200).json({ success: true, message: `Sent '${severity}': '${message}'` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.receiveLogs = async (req, res) => {
  const { severities = ["info"] } = req.body;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "direct", { durable: false });
    const q = await channel.assertQueue("", { exclusive: true });

    for (const severity of severities) {
      await channel.bindQueue(q.queue, EXCHANGE, severity);
    }

    channel.consume(
      q.queue,
      async (msg) => {
        if (msg && msg.content) {
          const logMsg = msg.content.toString();
          const routingKey = msg.fields.routingKey;
          await channel.close();
          await connection.close();
          return res.status(200).json({
            success: true,
            message: `Received log with severity: ${routingKey}`,
            data: logMsg
          });
        }
      },
      { noAck: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
