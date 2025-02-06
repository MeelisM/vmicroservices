import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

const proxyOptions = {
  target: "http://localhost:8080",
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

app.use("/", createProxyMiddleware(proxyOptions));

app.get("/api-docs", (req, res) => res.send("API Docs page here..."));

app.listen(8000, () => {
  console.log("API Gateway is running on port 8000");
});
