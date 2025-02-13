import amqp from "amqplib";
import rabbitmqConfig from "./config/rabbitmq.config.js";

let channel, connection;

export async function connectQueue() {
  try {
    connection = await amqp.connect(rabbitmqConfig.url);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqConfig.queue, {
      durable: true,
    });
    console.log(`RabbitMQ connection established to ${rabbitmqConfig.url}`);
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
    channel.sendToQueue(rabbitmqConfig.queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (error) {
    console.error("Error sending to queue:", error);
    throw error;
  }
}
