import express from "express";
import httpProxy from "http-proxy";
import { connectQueue } from "./rabbitmq.js";
import routes from "./routes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const proxy = httpProxy.createProxyServer({});

app.use(express.json());

const openApiDocument = yaml.load(readFileSync(join(__dirname, "openapi.yaml"), "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/movies", (req, res) => {
  const targetUrl = `http://localhost:8080${req.originalUrl}`;
  console.log(`Proxying request to: ${targetUrl}`);
  proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (error) => {
    if (error) {
      console.error("Error proxying the request:", error);
      res.status(500).json({ message: "Proxying error" });
    }
  });
});

app.use(routes);

async function startServer() {
  try {
    await connectQueue();
    const PORT = process.env.GATEWAY_PORT || 8000;
    app.listen(PORT, () => {
      console.log(`API Gateway is running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
