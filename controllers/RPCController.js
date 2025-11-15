const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");
const getConnection = require("../connection/RabbitConnection");

exports.rpcCall = async (req, res) => {
  const n = req.body.number || 6;
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    const q = await channel.assertQueue("", { exclusive: true });
    const correlationId = uuidv4();

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const result = msg.content.toString();
          setTimeout(() => connection.close(), 500);
          res.status(200).json({ success: true, message: `fib(${n}) result`, result });
        }
      },
      { noAck: true }
    );

    channel.sendToQueue("rpc_queue", Buffer.from(n.toString()), {
      correlationId,
      replyTo: q.queue,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.startServer = async (req, res) => {
  try {
    const connection = await getConnection();
    const channel = await connection.createChannel();
    const queue = "rpc_queue";

    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);

    channel.consume(queue, (msg) => {
      const n = parseInt(msg.content.toString());
      setTimeout(() => {
        const result = fibonacci(n);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(result.toString()),
          { correlationId: msg.properties.correlationId }
        );
        channel.ack(msg);
      }, 10000);
    });

    res.status(200).json({
      success: true,
      message: "RPC Server started and waiting for requests",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
