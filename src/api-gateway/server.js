import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const openApiDocument = yaml.load(readFileSync(join(__dirname, "openapi.yaml"), "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(morgan("dev"));

const proxyOptions = {
  target: "http://localhost:8080/api/movies",
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.originalUrl}`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Proxying to: ${proxyReq.url}`);
    console.log(`"Request Headers:", req.headers`);
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).json({ message: "Proxying error occurred." });
  },
};

app.use("/api/movies", createProxyMiddleware(proxyOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/billing", router);

app.listen(8000, () => {
  console.log("API Gateway is running on port 8000");
  console.log(`API Documentation available at http://localhost:8000/api-docs`);
});
