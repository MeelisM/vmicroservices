import amqp from "amqplib";
import rabbitmqConfig from "../config/rabbitmq.js";
import { processOrder } from "../controllers/order.controller.js";

export async function setupMessageQueue() {
  try {
    const connection = await amqp.connect(rabbitmqConfig.localUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitmqConfig.queue, {
      durable: true,
    });

    console.log(`##### Waiting for messages in ${rabbitmqConfig.queue}`);

    channel.consume(rabbitmqConfig.queue, async (msg) => {
      if (msg !== null) {
        try {
          const orderData = JSON.parse(msg.content.toString());
          await processOrder(orderData);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });

    connection.on("close", (err) => {
      console.error("RabbitMQ connection closed:", err);
      setTimeout(setupMessageQueue, 5000);
    });

    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    setTimeout(setupMessageQueue, 5000);
  }
}
