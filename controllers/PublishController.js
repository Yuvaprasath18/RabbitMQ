const amqp = require("amqplib");
const EXCHANGE = "logs";
const getConnection = require("../connection/RabbitConnection");

exports.publishMessage = async (req, res) => {
  const message = req.body.message || "Hello developers!";
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    channel.publish(EXCHANGE, "", Buffer.from(message));

    await channel.close();
    await connection.close();

    res.status(200).json({
      success: true,
      message: "Message published",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.receiveMessage = async (req, res) => {
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, EXCHANGE, "");

    const msg = await channel.get(q.queue, { noAck: true });

    if (!msg) {
      await channel.close();
      await connection.close();
      return res.status(200).json({
        success: false,
        message: "No messages available",
      });
    }

    const message = msg.content.toString();

    await channel.close();
    await connection.close();

    return res.status(200).json({
      success: true,
      message: `Received message from exchange: ${EXCHANGE}`,
      data: message,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
