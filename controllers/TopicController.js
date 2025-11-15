const amqp = require("amqplib");
const EXCHANGE = "topic_logs";
const getConnection = require("../connection/RabbitConnection");

exports.publishTopic = async (req, res) => {
  const { key = "anonymous.info", message = "Hello from Developer!" } = req.body;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "topic", { durable: false });
    channel.publish(EXCHANGE, key, Buffer.from(message));
    await channel.close();
    await connection.close();
    res.status(200).json({ success: true, message: `Sent '${key}': '${message}'` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.subscribeTopic = async (req, res) => {
  const { bindingKeys = [] } = req.body;
  if (!bindingKeys.length) {
    return res.status(400).json({ success: false, error: "Please provide bindingKeys array." });
  }

  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "topic", { durable: false });
    const q = await channel.assertQueue("", { exclusive: true });

    for (const key of bindingKeys) {
      await channel.bindQueue(q.queue, EXCHANGE, key);
    }

    channel.consume(
      q.queue,
      async (msg) => {
        if (msg && msg.content) {
          const content = msg.content.toString();
          const routingKey = msg.fields.routingKey;
          await channel.close();
          await connection.close();
          return res.status(200).json({
            success: true,
            message: `Received topic message with key: ${routingKey}`,
            data: content,
          });
        }
      },
      { noAck: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
