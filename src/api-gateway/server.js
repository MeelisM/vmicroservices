import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import gatewayConfig from "./config/gateway.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const openApiDocument = yaml.load(readFileSync(join(__dirname, "openapi.yaml"), "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(morgan("dev"));

const proxyOptions = {
  target: gatewayConfig.inventoryUrl,
  changeOrigin: true,
};

app.use("/api/movies", createProxyMiddleware(proxyOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/billing", router);

app.listen(gatewayConfig.port, () => {
  console.log(`##### API Gateway is running on port ${gatewayConfig.port}`);
  console.log(
    `##### API Documentation available at ${gatewayConfig.baseUrl}:${gatewayConfig.port}/api-docs`
  );
});
