import amqp from "amqplib";
import rabbitmqConfig from "./config/rabbitmq.config.js";

let channel;
let connection;

async function connectQueue() {
  try {
    connection = await amqp.connect(rabbitmqConfig.url);
    channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqConfig.queue, { durable: true });

    connection.on("close", async (err) => {
      console.error("RabbitMQ connection closed. Reconnecting...", err);
      setTimeout(connectQueue, 5000);
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    setTimeout(connectQueue, 5000);
  }
}

async function sendToQueue(data) {
  try {
    if (!channel) {
      await connectQueue();
    }
    console.log(`Sending message to queue: ${rabbitmqConfig.queue}`, data);
    channel.sendToQueue(rabbitmqConfig.queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`Message sent to queue: ${rabbitmqConfig.queue}`);
  } catch (error) {
    console.error("Error sending to queue:", error);
  }
}

export { connectQueue, sendToQueue };
