var amqp = require('amqplib');

async function message(){
    const connection = await amqp.connect("amqp://localhost");
    const channel=await connection.createChannel();
    const queue="hello";

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from("Hello Developer!"));

    console.log("Message sent");
    await channel.close();
    await connection.close();
}

message();