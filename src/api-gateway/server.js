import express from "express";
import { setupProxy } from "./proxy.js";
import routes from "./routes.js";
import { connectQueue } from "./rabbitmq.js";

const app = express();
app.use(express.json());

setupProxy(app);

app.use(routes);

async function startServer() {
  try {
    await connectQueue();

    const PORT = process.env.GATEWAY_PORT || 8000;
    app.listen(PORT, () => {
      console.log(`##### API Gateway is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("##### Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
