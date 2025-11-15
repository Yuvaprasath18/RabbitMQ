const amqp = require("amqplib");
const QUEUE = "hello";
const getConnection = require("../connection/RabbitConnection");

exports.sendMessage = async (req, res) => {
  const message = req.body.message || "Hello World";
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });

    await channel.close();
    await connection.close();

    res.status(200).json({
      success: true,
      message: "Message sent",
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
    await channel.assertQueue(QUEUE, { durable: true });

    const msg = await channel.get(QUEUE, { noAck: false });

    if (!msg) {
      await channel.close();
      await connection.close();
      return res.status(200).json({
        success: false,
        message: "No messages in queue",
      });
    }

    const message = msg.content.toString();
    channel.ack(msg);

    await channel.close();
    await connection.close();

    return res.status(200).json({
      success: true,
      message: `Received message from queue: ${QUEUE}`,
      data: message,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
