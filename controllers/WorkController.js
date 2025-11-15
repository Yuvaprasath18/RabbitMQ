const amqp = require("amqplib");
const getConnection = require("../connection/RabbitConnection");

exports.sendMessage = async (req, res) => {
  const { queue = "task_queue", message = "Hello Task!" } = req.body;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    await channel.close();
    await connection.close();
    res.status(200).json({ success: true, message: `Sent: ${message}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.receiveMessage = async (req, res) => {
  const { queue = "task_queue" } = req.body;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    channel.consume(
      queue,
      async (msg) => {
        if (msg && msg.content) {
          const task = msg.content.toString();
          channel.ack(msg);
          await channel.close();
          await connection.close();
          return res.status(200).json({
            success: true,
            message: `Received message from queue: ${queue}`,
            data: task,
          });
        }
      },
      { noAck: false }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
