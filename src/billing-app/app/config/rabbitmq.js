export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || "amqp://localhost",
  queue: "billing_queue",
};

export default rabbitmqConfig;
