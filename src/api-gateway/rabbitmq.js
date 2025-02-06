import amqp from "amqplib";

let channel, connection;

export async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("billing_queue", {
      durable: true,
    });
    console.log("RabbitMQ connection established");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

export async function sendToQueue(data) {
  try {
    if (!channel) {
      await connectQueue();
    }
    channel.sendToQueue("billing_queue", Buffer.from(JSON.stringify(data)), { persistent: true });
  } catch (error) {
    console.error("Error sending to queue:", error);
    throw error;
  }
}
